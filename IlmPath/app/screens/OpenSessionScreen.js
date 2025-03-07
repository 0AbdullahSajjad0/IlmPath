import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import {
  width,
  height,
  responsiveIconSize,
  responsiveMargin,
  responsiveFontSize,
  AttachIcon,
  MicIcon,
  globalStyles,
} from '../styles/globalStyles';
import { useUser } from '../../context/UserContext';
import io from 'socket.io-client';
import config from '../../config';
import {endAppointment} from '../services/appointmentService';

export default function OpenSessionScreen({ navigation, route }) {
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const { appointment } = route.params; 
  const socket = io(`${config.apiBaseUrl}`);

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
      setChats(prevChats => [...prevChats, newMessage]);
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
  };
  

  return (
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
              <Text style={styles.chatText}>{chat.text}</Text>
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
          />
          <TouchableOpacity
            style={styles.attachButton}
            onPress={() => console.log('Attach file pressed')}
          >
            <AttachIcon/>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.micButton}
            onPress={sendMessage}
          >
            <MicIcon/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

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
  attachButton: {
    marginHorizontal: responsiveMargin(15),
  },
  attachIcon: {
    width: responsiveIconSize(18),
    height: responsiveIconSize(18),
    resizeMode: 'contain',
  },
  micButton: {
    backgroundColor: '#BC6C25',
    width: responsiveIconSize(35),
    height: responsiveIconSize(35),
    borderRadius: responsiveIconSize(17.5),
    padding: responsiveMargin(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIcon: {
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
