import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform  } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import { Audio } from 'expo-av';
import {
  responsiveMargin,
  responsiveFontSize,
  responsiveIconSize,
  globalStyles,
} from '../styles/globalStyles';

export default function SurahFinderScreen({ navigation }) {
  const [isOn, setIsOn] = useState(false);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);

  const handleImagePress = async () => {
    if (!isOn) {
      // Start recording
      console.log('Starting recording...');
      try {
        // Request microphone permissions
        const permission = await Audio.requestPermissionsAsync();
        if (permission.status !== 'granted') {
          console.log('Permission to access microphone was denied');
          return;
        }

        // Set audio mode for both iOS and Android
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          // Android-specific options
          shouldDuckAndroid: true, // Lower volume of other audio
        });

        // Clear any previous recording if necessary
        if (recording) {
          await recording.stopAndUnloadAsync();
        }
        setAudioUri(null); // Overwrite previous audio

        // Create a new recording instance
        const recordingInstance = new Audio.Recording();
        await recordingInstance.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        await recordingInstance.startAsync();
        setRecording(recordingInstance);
        setIsOn(true);
        console.log('Recording started');
      } catch (error) {
        console.error('Failed to start recording:', error);
      }
    } else {
      // Stop recording
      console.log('Stopping recording...');
      try {
        setIsOn(false);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setAudioUri(uri);
        console.log('Recording stopped and stored at:', uri);
        setRecording(null);
      } catch (error) {
        console.error('Failed to stop recording:', error);
      }
    }
  };

  // Plays the recorded audio upon pressing the submit button
  const handleSubmitPress = async () => {
    if (!audioUri) {
      console.log('No audio recorded to play');
      return;
    }
    try {
      console.log('Playing recorded audio:', audioUri);
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };


  return (
    <View style={[globalStyles.container,{backgroundColor: '#F0DEAE'}]}>
      {/* Top Section: Header & Toggle */}
      <View style={styles.topSection}>
        <View style={globalStyles.headerContainer}> 
            <View style={globalStyles.backButtonContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                source={require('../assets/images/Back_Icon.png')}
                style={[globalStyles.icon, globalStyles.backIcon]}
                />
            </TouchableOpacity>
            <Text style={[globalStyles.backText, globalStyles.subtitle]}>Surah Finder</Text>
            </View>
        </View>
        {/* Wrap the toggle switch in its own container to enforce left alignment */}
        <View style={styles.toggleContainer}>
          <ToggleSwitch
            isOn={isOn}
            onColor="#BCC29A"
            offColor="#EF6868"
            size="large"
            disabled={true} // disables direct toggling; only image toggles it
          />
        </View>
      </View>

      {/* Center Section: Image Button & Submit Button */}
      <View style={styles.centerContainer}>
        {/* Image acting as a toggle button */}
        <TouchableOpacity onPress={handleImagePress}>
          <Image
            source={require('../assets/images/mic_pic.png')}
            style={styles.boxImage}
          />
        </TouchableOpacity>
        {/* Submit Button */}
        <TouchableOpacity style={styles.boxButton} onPress={handleSubmitPress}>
          <Text style={styles.boxButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F0DEAE',
  },
  // Top section for header and toggle – left aligned
  topSection: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    paddingHorizontal: responsiveMargin(10),
    paddingTop: responsiveMargin(10),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: responsiveIconSize(24),
    height: responsiveIconSize(24),
    resizeMode: 'contain',
  },
  headerTitle: {
    marginLeft: responsiveMargin(10),
    fontSize: responsiveFontSize(18),
  },
  // Container for the toggle switch to ensure left alignment
  toggleContainer: {
    marginTop: responsiveMargin(10),
    marginLeft: responsiveMargin(20),
    alignSelf: 'flex-start',
  },
  // Center section with the clickable image and submit button
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxImage: {
    marginTop: responsiveMargin(-100),
    marginBottom: responsiveMargin(20),
    width: responsiveIconSize(220),
    height: responsiveIconSize(220),
    resizeMode: 'contain',
  },
  boxButton: {
    backgroundColor: '#BC6C25',
    borderRadius: 8,
    paddingVertical: responsiveMargin(12),
    paddingHorizontal: responsiveMargin(16),
    marginTop: responsiveMargin(20),
  },
  boxButtonText: {
    fontSize: responsiveFontSize(14),
    color: 'white',
  },
});
