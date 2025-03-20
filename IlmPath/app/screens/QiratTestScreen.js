  import React, { useState, useEffect } from 'react';
  import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
  } from 'react-native';
  import ToggleSwitch from 'toggle-switch-react-native';
  import { Audio } from 'expo-av';
  import {
    responsiveMargin,
    responsiveFontSize,
    responsiveIconSize,
    globalStyles,
    width,
  } from '../styles/globalStyles';
  import { sendAudioForTajweedAnalysis } from '../services/tajweedService';
  import * as FileSystem from 'expo-file-system';
  import Modal from 'react-native-modal';

  const QuranData = require('../assets/data/QuranDataInJson.json');

  export default function QiratTestScreen({ navigation }) {
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState(null);
    const [audioUri, setAudioUri] = useState(null);
    const [ayah, setAyah] = useState('');
    const [sound, setSound] = useState(null); // For audio playback
    const [isModalVisible, setModalVisible] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    // Fetch the first Ayah of Surah An-Nas (Surah 114)
    useEffect(() => {
      const foundAyah = QuranData.find(
        (ayah) => parseInt(ayah.surah_no) === 114 && parseInt(ayah.ayah_no_surah) === 4
      );
      setAyah(foundAyah ? foundAyah.ayah_ar : 'Ayah Not Found');
      console.log('Fetched Ayah:', ayah);
    }, []);

    // ✅ Handle Recording
    const handleRecordingToggle = async () => {
      if (!isRecording) {
        try {
          const permission = await Audio.requestPermissionsAsync();
          if (permission.status !== 'granted') {
            Alert.alert('Permission Denied', 'Microphone access is required to record.');
            return;
          }

          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
          });

          if (recording) {
            await recording.stopAndUnloadAsync();
          }
          setAudioUri(null);

          const newRecording = new Audio.Recording();
          await newRecording.prepareToRecordAsync({
            android: {
                extension: '.wav',
                outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_LINEARPCM,
                audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT, // Set to DEFAULT
                sampleRate: 16000,  // ✅ Match the backend requirement
                numberOfChannels: 1,
                bitRate: 256000,
            },
            ios: {
                extension: '.wav',
                audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
                sampleRate: 16000,  // ✅ Match the backend requirement
                numberOfChannels: 1,
                bitRate: 256000,
                linearPCMBitDepth: 16,
                linearPCMIsBigEndian: false,
                linearPCMIsFloat: false,
            },
        });
        

          await newRecording.startAsync();
          setRecording(newRecording);
          setIsRecording(true);
          console.log('Recording started...');
        } catch (error) {
          console.error('Error starting recording:', error);
        }
      } else {
        try {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          setAudioUri(uri);
          console.log('Recording saved at:', uri);
          setRecording(null);
          setIsRecording(false);

          // ✅ Play recorded audio
          await playAudio(uri);
        } catch (error) {
          console.error('Error stopping recording:', error);
        }
      }
    };

    // ✅ Function to Play the Recorded Audio
    const playAudio = async (uri) => {
      try {
        if (sound) {
          await sound.unloadAsync(); // Unload previous sound if exists
        }

        const { sound: newSound } = await Audio.Sound.createAsync({ uri });
        setSound(newSound);
        await newSound.playAsync(); // Play audio
        console.log("Playing recorded audio:", uri);
      } catch (error) {
        console.error("Error playing recorded audio:", error);
      }
    };

    const handleTestPress = async () => {
      if (!audioUri) {
        Alert.alert('No Recording', 'Please record an audio before testing.');
        return;
      }

      try {
        const response = await sendAudioForTajweedAnalysis(audioUri);
        console.log('🔹 API Response:', response);

        if (response && response.combined_confidence !== undefined) {
          const getEmoji = (value) => (value === 1 ? '✅' : '❌');
          setAnalysisResult({
            confidence: response.combined_confidence.toFixed(2),
            separateTide: getEmoji(response.label_separate_tide),
            concealment: getEmoji(response.label_concealment),
            tightNoon: getEmoji(response.label_tight_noon),
          });
          setModalVisible(true);
        } else {
          Alert.alert('Analysis Failed', 'No valid results returned.');
        }
      } catch (error) {
        console.error('🚨 Error fetching Tajweed analysis:', error);
        Alert.alert('Error', 'Failed to analyze Tajweed. Please try again.');
      }
    };
    
    

    return (
      <View style={[globalStyles.container, { backgroundColor: '#F0DEAE' }]}>
        {/* Header Section */}
        <View style={styles.topSection}>
          <View style={globalStyles.headerContainer}>
            <View style={globalStyles.backButtonContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  source={require('../assets/images/Back_Icon.png')}
                  style={[globalStyles.icon, globalStyles.backIcon]}
                />
              </TouchableOpacity>
              <Text style={[globalStyles.backText, globalStyles.subtitle]}>Qirat Test</Text>
            </View>
          </View>
        </View>

        {/* Toggle Switch (Left-Aligned) */}
        <View style={styles.toggleContainer}>
          <ToggleSwitch
            isOn={isRecording}
            onColor="#2ECC71" // Green when recording
            offColor="#E74C3C" // Red when stopped
            size="large"
            disabled={true}
          />
        </View>

        {/* Display Quranic Ayah */}
        <View style={styles.ayahContainer}>
          <Text style={styles.ayahText}>{ayah}</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {/* Left Button: Start / Stop */}
          <TouchableOpacity
            style={[styles.button, isRecording ? styles.stopButton : styles.startButton]}
            onPress={handleRecordingToggle}
          >
            <Text style={styles.buttonText}>{isRecording ? 'Stop' : 'Start'}</Text>
          </TouchableOpacity>

          {/* Right Button: Test */}
          <TouchableOpacity style={[styles.button, styles.testButton]} onPress={handleTestPress}>
            <Text style={styles.buttonText}>Test</Text>
          </TouchableOpacity>
        </View>

        {/* Styled Modal for Tajweed Analysis */}
        <Modal isVisible={isModalVisible} animationIn="slideInUp" animationOut="slideOutDown">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Tajweed Analysis</Text>
            
            {analysisResult && (
              <View style={styles.analysisContainer}>
                {/* First Row: Labels */}
                <View style={styles.analysisRow}>
                  <Text style={styles.analysisHeader}>Separate Tide</Text>
                  <Text style={styles.analysisHeader}>Concealment</Text>
                  <Text style={styles.analysisHeader}>Tight Noon</Text>
                </View>

                {/* Second Row: Emojis */}
                <View style={styles.analysisRow}>
                  <Text style={styles.emoji}>{analysisResult.separateTide}</Text>
                  <Text style={styles.emoji}>{analysisResult.concealment}</Text>
                  <Text style={styles.emoji}>{analysisResult.tightNoon}</Text>
                </View>

                {/* Third Row: Confidence Score */}
                <Text style={styles.confidenceText}>Confidence: {analysisResult.confidence}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>


      </View>
    );
  }

  const styles = StyleSheet.create({
    topSection: {
      alignSelf: 'stretch',
      alignItems: 'flex-start',
      paddingHorizontal: responsiveMargin(10),
      paddingTop: responsiveMargin(10),
    },
    toggleContainer: {
      marginTop: responsiveMargin(10),
      marginLeft: responsiveMargin(20),
      alignSelf: 'flex-start',
    },
    ayahContainer: {
      flex: 3,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: responsiveMargin(20),
    },
    ayahText: {
      fontSize: responsiveFontSize(50),
      textAlign: 'center',
      fontWeight: 'bold',
      fontFamily: 'NotoNaskhArabic-Bold',
      color: '#4E240D',
      color: 'black',
    },
    buttonContainer: {
      flex: 0.5,
      flexDirection: 'row',
      justifyContent: "space-between",
      paddingBottom: responsiveMargin(50),
    },
    button: {
      width: width / 4,
      height: responsiveMargin(40),
      paddingVertical: responsiveMargin(12),
      marginHorizontal: responsiveMargin(10),
      borderRadius: 10,
      alignItems: 'center',
    },
    startButton: {
      backgroundColor: '#BC6C25',
    },
    stopButton: {
      backgroundColor: '#E74C3C',
    },
    testButton: {
      backgroundColor: '#3498DB',
    },
    buttonText: {
      fontSize: responsiveFontSize(14),
      color: 'white',
      fontWeight: 'bold',
    },
    modalContainer: {
      backgroundColor: 'white',
      padding: responsiveMargin(20),
      borderRadius: responsiveIconSize(10),
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalTitle: {
      fontSize: responsiveFontSize(18),
      fontWeight: 'bold',
      marginBottom: responsiveMargin(10),
      color: '#BC6C25',
    },
    analysisContainer: {
      width: '100%',
      alignItems: 'center',
    },
    analysisRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginVertical: responsiveMargin(10),
    },
    analysisHeader: {
      fontSize: responsiveFontSize(14),
      fontFamily: 'Jost-SemiBold',
      fontWeight: 'bold',
      color: '#E0B15E',
    },
    emoji: {
      fontSize: responsiveFontSize(20), // Bigger Emoji
      textAlign: 'center',
    },
    confidenceText: {
      fontSize: responsiveFontSize(15),
      fontFamily: 'Jost-SemiBold',
      fontWeight: 'bold',
      marginTop: responsiveMargin(10),
      color: '#BC6C25',
    },
    closeButton: {
      backgroundColor: '#BC6C25',
      padding: responsiveMargin(10),
      marginTop: responsiveMargin(15),
      borderRadius: responsiveIconSize(5),
    },
  });
