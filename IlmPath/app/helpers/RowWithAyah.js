import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, Image, ImageBackground, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { width, height, responsiveIconSize, responsiveMargin, responsiveFontSize, BookmarkIcon, PlayIcon, NoteIcon, globalStyles } from '../styles/globalStyles';
import QuranData from '../assets/data/QuranDataInJson.json';
import AudioMapping from '../assets/data/audioMapping.json';
import { useUser } from '../../context/UserContext';
import { trackProgress } from '../services/progressService';
import { fetchNote, saveNote } from '../services/noteService';
import { Audio } from 'expo-av'; // Import Expo AV for audio playback
import StaticAudioMapping from '../assets/data/StaticAudioMapping';

const RowWithAyah = ({ 
  number, 
  arabicText, 
  englishText, 
  surahId, 
  user, 
  onProgressTrack, // Callback to handle progress tracking
  enableProgressTracking = false, // Flag to enable/disable progress tracking
  currentlyPlayingAyah,
  setCurrentlyPlayingAyah 
}) => {
  const [activeIcon, setActiveIcon] = useState(null);
  const [isTextAreaVisible, setTextAreaVisible] = useState(false);
  const [note, setNote] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);

  const requestAudioPermission = async () => {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      alert('Audio permissions are required to play the audio.');
    }
  };

  useEffect(() => {
    requestAudioPermission();
  }, []);

  const playAudio = async (surahId, ayahNumber) => {
    const ayahKey = `${surahId.toString().padStart(3, '0')}${ayahNumber.toString().padStart(3, '0')}`;
    const filePath = StaticAudioMapping[ayahKey];

    if (!filePath) {
      console.error(`Audio file not found for key ${ayahKey}`);
      alert('Audio file not found.');
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(filePath, { shouldPlay: true });
      setCurrentSound(sound);
      setCurrentlyPlayingAyah(ayahKey);

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
          setCurrentSound(null);
          setIsPlaying(false);

          // Reset the currently playing Ayah
          setCurrentlyPlayingAyah(null);

          setActiveIcon(null);
          // Track progress only after playback finishes and if enabled
          if (enableProgressTracking && onProgressTrack) {
            onProgressTrack(number);
          }
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      alert('Error playing audio.');
    }
  };

  const handleIconPress = async (icon) => {
    if ((!user || !user.id || !user.role) && icon !== 'play') {
        alert('Please log in to use this feature.');
        return; // Prevent further execution
    }
    
    setActiveIcon(icon === activeIcon ? null : icon);

    if (icon === 'play') {
      
      const ayahKey = `${surahId.toString().padStart(3, '0')}${number.toString().padStart(3, '0')}`;

      // If another Ayah is playing, prevent this one from playing
      if (currentlyPlayingAyah && currentlyPlayingAyah !== ayahKey) {
        setActiveIcon(null);
        alert('Please stop the currently playing Ayah or finish it before playing another one.');
        return;
      }

      if (isPlaying && currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
        setCurrentSound(null);
        setIsPlaying(false);
        return;
      }

      setIsPlaying(true);
      await playAudio(surahId, number);
    }

    

    if (icon === 'note') {
      if (!isTextAreaVisible) {
        const fetchedNote = await fetchNote(user, surahId, number);
        setNote(fetchedNote);
      } else if (note.trim() !== '') {
        await saveNote(user, surahId, number, note);
      }
      setTextAreaVisible(!isTextAreaVisible);
    }
  };

  return (
    <>
      <View style={styles.rowContainer}>
        <View style={styles.numberCircle}>
          <Text style={styles.numberText}>{number}</Text>
        </View>

        {/* Icons */}
        <View style={styles.iconsContainer}>
            
            <TouchableOpacity
                style={[
                styles.iconWrapper,
                activeIcon === 'note' && styles.activeIconWrapper,
                ]}
                onPress={() => handleIconPress('note')}
            >
                <NoteIcon />
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                styles.iconWrapper,
                activeIcon === 'play' && styles.activeIconWrapper,
                ]}
                onPress={() => handleIconPress('play')}
            >
                <PlayIcon />
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                styles.iconWrapper,
                activeIcon === 'bookmark' && styles.activeIconWrapper,
                ]}
                onPress={() => handleIconPress('bookmark')}
            >
                <BookmarkIcon filled={activeIcon === 'bookmark'} />
            </TouchableOpacity>
            
        </View>
        
      </View>

      {/* Ayah with Translation */}
        <View style={styles.ayahContainer}>
        <Text style={styles.arabicAyahText}>{arabicText}</Text>
        <Text style={styles.englishAyahText}>{englishText}</Text>
        </View>

      {/* Text Area */}
      {isTextAreaVisible && (
           <TextInput
           style={styles.textArea}
           value={note}
           onChangeText={setNote}
           placeholder="Add a Note to this Ayah"
           multiline
           numberOfLines={4}
           textAlignVertical="top" // Align text to the top in multiline mode
         />
       )}
    </>
  );
};

export default RowWithAyah;

const styles = StyleSheet.create({
    gradientBackground: {
      paddingHorizontal: responsiveMargin(87),
      paddingVertical: responsiveMargin(30),
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backgroundImage: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: '400',
      marginBottom: 20,
      color: 'white',
    },
    arabicText: {
      fontSize: 18,
      color: 'white',
    },
    detailsText: {
      fontSize: 16,
      color: 'white',
      marginBottom: 20,
    },
    horizontalLine: {
      width: width/2.4, // Adjust to ensure it's wide enough
      height: 2, // Thin line
      backgroundColor: 'white', // Use black for visibility; adjust if needed
      color: 'white',
      borderWidth: 1, // Add a border to ensure the line is visible
      borderRadius: 1, // Round the corners
      borderColor: 'white', // Use black for visibility; adjust if needed
      alignSelf: 'center', // Center the line horizontally
      marginVertical: 20, // Add spacing above and below the line
    },
    errorText: {
      fontSize: 18,
      color: 'red',
    },
    firstAyahArabic: {
      fontSize: 22,
      color: 'white',
      textAlign: 'center', // Center the Ayah text
      marginBottom: 10,
    },
    rowContainer: {
      width: width/1.15, // Adjust width for two boxes side by side
      height: height/17,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#EAC98F',  
      borderRadius: 8,
      marginVertical: responsiveMargin(20),
      paddingHorizontal: responsiveMargin(20),
    },
    numberCircle: {
      width: responsiveIconSize(30),
      height: responsiveIconSize(30),
      borderRadius: responsiveIconSize(20), // Makes it a circle
      backgroundColor: '#E0B15E',  
      justifyContent: 'center',
      alignItems: 'center',
    },
    numberText: {
      fontSize: responsiveFontSize(14),
      color: '#4E240D',
      fontWeight: 'bold',
    },
    iconsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    iconWrapper: {
      width: responsiveIconSize(36),
      height: responsiveIconSize(36),
      borderRadius: responsiveIconSize(18), // Makes it circular
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeIconWrapper: {
      width: responsiveIconSize(32),
      height: responsiveIconSize(32),
      backgroundColor: '#E0B15E', // Highlight background for active icon
    },
    iconStyle: {
      width: responsiveIconSize(20),
      height: responsiveIconSize(20),
      resizeMode: 'contain',
    },
    ayahContainer: {
      width: width/1.18, // Adjust width for two boxes side by side
      borderRadius: 10,
      shadowColor: '#000', // Shadow for iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2, // Shadow for Android
      alignItems: 'center', // Center align text
    },
    arabicAyahText: {
      alignSelf: 'flex-end',
      fontSize: responsiveFontSize(18),
      fontWeight: '600',
      color: 'black', // Darker color for Arabic text
      textAlign: 'center',
      marginBottom: responsiveMargin(20), // Space between Arabic and English text
    },
    englishAyahText: {
      alignSelf: 'flex-start',
      fontSize: responsiveFontSize(14),
      fontWeight: '400',
      color: 'black', // Lighter color for English text
    },
    textArea: {
      width: width/1.25,
      height: height/6,
      backgroundColor: '#EAC98F',
      borderRadius: 8,
      padding: 10,
      margin: responsiveMargin(20),
      alignSelf: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2, // Shadow for Android
      fontSize: responsiveFontSize(14),
      color: '#333',
    },
    
    
  });
  