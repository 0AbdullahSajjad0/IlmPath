import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  width,
  height,
  responsiveIconSize,
  responsiveMargin,
  responsiveFontSize,
  AttachIcon,
  MicIcon,
  SendIcon,
  globalStyles,
} from '../styles/globalStyles';
import { Audio } from 'expo-av';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // ✅ Import this
import * as FileSystem from 'expo-file-system';
import { useUser } from '../../context/UserContext';
import io from 'socket.io-client';
import config from '../../config';
import {endAppointment} from '../services/appointmentService';

export default function OpenSessionScreen({ navigation, route }) {
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const { appointment } = route.params; 
  const socket = io(`${config.apiBaseUrl}`);
  const scrollViewRef = useRef();
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);


  const displayName =
  user.role === 'ullama'
    ? appointment.student_name
    : appointment.ulama_name;

  const displayProfileImage =
  user.role === 'ullama'
    ? appointment.student_profile_image
    : appointment.profileImage;
  
  const [profileImage, setProfileImage] = useState(null);
  const [chats, setChats] = useState([]);
  useEffect(() => {
    (async () => {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
            alert("Microphone access is required to record audio.");
        }
    })();
  }, []);

  useEffect(() => {
    const checkAppointmentEnd = () => {
      const appointmentTime = new Date(appointment.appointment_datetime);
      const currentTime = new Date();
  
      const timeDifference = (currentTime - appointmentTime) / (1000 * 60); // in minutes
      const isSameDate = appointmentTime.toDateString() === currentTime.toDateString();
  
      if (timeDifference >= 60 && isSameDate) {
        Alert.alert(
          'Appointment Ended',
          'The session time has completed.',
          [{ text: 'OK', onPress: async () => {
            const success = await endAppointment(appointment.id);
            if (success) {
              navigation.goBack();
            } else {
              Alert.alert('Error', 'Failed to end the appointment. Please try again.');
            }
          },
        }]
        );
      }
    };
  
    const intervalId = setInterval(checkAppointmentEnd, 60000); // check every 1 minute
  
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    socket.emit('joinRoom', appointment.chat_id);
    console.log('Joined room:', appointment.chat_id);
  
    socket.on('receiveMessage', (newMessage) => {
      console.log('New message received:', newMessage);
      if (newMessage.audio) {
        console.log("Received Base64 Audio:", newMessage.audio.substring(0, 50)); // Print first 50 chars
      }
      setChats(prevChats => [...prevChats, newMessage]);

      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      });
    });

    // 👇 Listen for session end
    socket.on('sessionEnded', () => {
      console.log('Session ended. Navigating back.');
      Alert.alert(
        "Session Ended",
        "This appointment has ended.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    });
  
    return () => {
      socket.off('receiveMessage');
      socket.off('sessionEnded');
    };
  }, []);
  

  const sendMessage = () => {
    console.log('Sending message:', message);
    if (!message.trim()) return;
  
    const newMessage = {
      chatId: appointment.chat_id,
      senderId: user.id,
      senderRole: user.role,
      text: message,
    };
  
    socket.emit('sendMessage', newMessage);

    setMessage('');

    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
  };

  const handleMicPress = async () => {
    try {
        if (isRecording) {
            console.log("Stopping recording...");
            setIsRecording(false);
            await recording.stopAndUnloadAsync();
            
            const uri = recording.getURI();
            console.log("Recorded URI:", uri);

            setRecording(null); // ✅ Reset state
            sendVoiceMessage(uri); // ✅ Send URI instead of blob
        } else {
            console.log("Starting recording...");
            setIsRecording(true);

            // ✅ Set Audio Mode for iOS before recording
            await Audio.setAudioModeAsync({
              allowsRecordingIOS: true,  // ✅ Enable recording
              playsInSilentModeIOS: true,
              staysActiveInBackground: true
            });

            const { granted } = await Audio.requestPermissionsAsync();
            if (!granted) {
                alert("Audio permissions required");
                return;
            }

            const newRecording = new Audio.Recording();
            await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await newRecording.startAsync();
            setRecording(newRecording);
        }
    } catch (error) {
        console.error("Mic Error:", error);
        setIsRecording(false);
    }
};




const sendVoiceMessage = async (audioUri) => {
  if (!audioUri) return;

  try {
    // Convert file to Base64
    const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Send as Base64 string
    const voiceMessage = {
      chatId: appointment.chat_id,
      senderId: user.id,
      senderRole: user.role,
      audio: base64Audio,  // ✅ Sending base64 instead of URI
      fileType: "audio/m4a",  // Include the file type
    };

    console.log("Sending Base64 voice message:", base64Audio.substring(0, 50)); // Print only the first 50 characters to check
    socket.emit("sendMessage", voiceMessage);
  } catch (error) {
    console.error("Error encoding audio:", error);
  }
};


  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // ✅ Prevent overlap
    >
    <View style={[globalStyles.container, { backgroundColor: '#F0DEAE' }]}>
      {/* Header with Back Button and Profile Picture */}
      <View style={globalStyles.headerContainer}>
        <View style={globalStyles.backButtonContainer}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'End Session',
                'Are you sure you want to leave? This will end the appointment.',
                [
                  { text: 'No', style: 'cancel' },
                  { text: 'Yes', onPress: async () => {
                      console.log('Ending Appointment:', appointment.id);
                      const success = await endAppointment(appointment.id);
                      console.log('End Appointment Success:', success);
                      if (success) {
                        socket.emit('endSession', { chatId: appointment.chat_id });
                        navigation.goBack();
                      } else {
                        Alert.alert('Error', 'Failed to end the appointment. Please try again.');
                      }
                    },
                  },
                ]
              );
            }}
          >
            <Image
              source={require('../assets/images/Back_Icon.png')}
              style={[globalStyles.icon, styles.backIcon]}
            />
          </TouchableOpacity>

          <View style={styles.profilePicture}>
            <Image
              source={
                displayProfileImage
                  ? { uri: displayProfileImage }
                  : require('../assets/images/Set_Picture.png')
              }
              style={styles.profileImage}
            />
          </View>
          <Text
            style={[
              globalStyles.subtitle,
              globalStyles.backText,
              { fontSize: responsiveFontSize(16) },
            ]}
          >
            {displayName}
          </Text>
        </View>
      </View>

      {/* Scrollable Chat / Middle Section */}
      <View style={{ flex: 1, width: '100%' }}>
      {chats.length > 0 ? (
        <ScrollView
          ref={scrollViewRef} 
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-end', // ✅ Start messages from the bottom
            paddingHorizontal: responsiveMargin(20),
          }}
          showsVerticalScrollIndicator={false}
          inverted
        >
          {chats.map((chat, index) => (
            <View
              key={index}
              style={[
                styles.chatBubble,
                chat.senderRole === user.role
                  ? styles.myChatBubble
                  : styles.otherChatBubble,
              ]}
            >
              {chat.audio ? (
                  <TouchableOpacity onPress={() => playAudio(chat.audio)}>
                      <Text style={styles.chatText}>🎵 Play Voice Message</Text>
                  </TouchableOpacity>
              ) : (
                  <Text style={styles.chatText}>{chat.text}</Text>
              )}
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.middleSection}>
          <Image
            source={require('../assets/images/QuranLogo.png')}
            style={styles.logo}
          />
          <Text style={styles.middleText1}>
            Welcome User
          </Text>
          <Text style={styles.middleText1}>
            Write a Message and get Started!
          </Text>
        </View>
      )}
      </View>


      {/* Input Field at the bottom */}
      <View style={styles.inputFieldContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            value={message}  
            onChangeText={setMessage}  
            onFocus={() => {
              // ✅ Scroll to bottom when input field is focused
              console.log('Scrolling to bottom');
              requestAnimationFrame(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              });
            }}
          />
          <TouchableOpacity
            style={[styles.micButton, isRecording && styles.micRecording]}
            onPress={handleMicPress}
          >
            <MicIcon/>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
          >
            <SendIcon/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
  );
}

const playAudio = async (audioBase64) => {
  console.log("Playing Audio...");
  try {
    // Save Base64 data to a file
    if (!audioBase64) {
      console.log("Error: Received empty Base64 audio data");
      console.error("Error: Received empty Base64 audio data");
      return;
    }

    console.log("Received Base64 audio:", audioBase64.substring(0, 100)); // Log first 100 characters for debugging

    const filePath = `${FileSystem.cacheDirectory}temp_audio.m4a`;

    await FileSystem.writeAsStringAsync(filePath, audioBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log("Playing audio from Base64:", filePath);

    const { sound } = await Audio.Sound.createAsync(
      { uri: filePath },
      { shouldPlay: true }
    );

    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      console.log(`Audio Duration: ${status.durationMillis / 1000} seconds`);
    } else {
      console.log("Failed to load audio.");
    }

    await sound.playAsync();
  } catch (error) {
    console.error("Playback Error:", error);
  }
};



const styles = StyleSheet.create({
  backIcon: {
    width: responsiveIconSize(20),
    height: responsiveIconSize(20),
  },
  profileImage: {
    width: responsiveIconSize(30),
    height: responsiveIconSize(30),
    resizeMode: 'contain',
  },
  profilePicture: {
    width: responsiveIconSize(40),
    height: responsiveIconSize(40),
    borderRadius: responsiveIconSize(40),
    marginHorizontal: responsiveMargin(18),
    backgroundColor: '#E8F1FF',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  middleSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: responsiveIconSize(100),
    height: responsiveIconSize(100),
    resizeMode: 'contain',
    marginBottom: responsiveMargin(10),
  },
  middleText1: {
    fontSize: responsiveFontSize(14),
    paddingHorizontal: responsiveMargin(20),
    color: '#333',
    marginBottom: responsiveMargin(5),
    marginVertical: responsiveMargin(10),
    fontFamily: 'Jost-SemiBold',
  },
  chatBubble: {
    padding: responsiveMargin(12),
    borderRadius: 12,
    marginVertical: responsiveMargin(5),
    maxWidth: '80%',
  },
  
  myChatBubble: {
    backgroundColor: '#BC6C25',
    alignSelf: 'flex-end', // Right side
    borderTopRightRadius: 0,
  },
  
  otherChatBubble: {
    backgroundColor: '#EAC98F',
    alignSelf: 'flex-start', // Left side
    borderTopLeftRadius: 0,
  },
    
  inputFieldContainer: {
    width: '100%',
    margin: responsiveMargin(15),
    paddingHorizontal: responsiveMargin(15),
    paddingVertical: responsiveMargin(15),
    backgroundColor: '#F0DEAE',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 35,
    paddingHorizontal: responsiveMargin(15),
    paddingVertical: responsiveMargin(12),
  },
  input: {
    flex: 1,
    fontSize: responsiveFontSize(14),
    color: '#333',
  },
  micButton: {
    marginHorizontal: responsiveMargin(15),
  },
  micRecording: {
    backgroundColor: '#FF4D4D', // Change mic color when recording
  },
  attachIcon: {
    width: responsiveIconSize(18),
    height: responsiveIconSize(18),
    resizeMode: 'contain',
  },
  sendButton: {
    backgroundColor: '#BC6C25',
    width: responsiveIconSize(35),
    height: responsiveIconSize(35),
    borderRadius: responsiveIconSize(17.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: responsiveIconSize(15),
    height: responsiveIconSize(15),
    resizeMode: 'contain',
  },
  chatText: {
    fontSize: responsiveFontSize(14),
    color: '#4E240D',
    fontFamily: 'Jost-SemiBold',
  },
});
