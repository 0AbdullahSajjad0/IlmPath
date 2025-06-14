import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { width, height, responsiveIconSize, responsiveMargin, responsiveFontSize, BookmarkIcon, PlayIcon, NoteIcon } from '../styles/globalStyles';
import { fetchNote, saveNote } from '../services/noteService';
import { toggleBookmark, getBookmarks } from '../services/bookmarkService';
import { Audio } from 'expo-av';
import StaticAudioMapping from '../assets/data/StaticAudioMapping';
import wordMeanings from '../assets/data/RootMeanings.json';
import Modal from 'react-native-modal';
import { useUser } from '../../context/UserContext';  // ✅ Import useUser to fetch context

const RowWithAyah = ({ 
  number, 
  arabicText, 
  englishText, 
  surahId, 
  allWords, // ✅ Use this for display
  mappedWords, // ✅ Use this for meaning lookup
  onProgressTrack, // Callback to handle progress tracking
  enableProgressTracking = false, // Flag to enable/disable progress tracking
  currentlyPlayingAyah,
  setCurrentlyPlayingAyah,
  removeBookmark
}) => {
  const { user } = useUser(); // ✅ Fetch user directly from context
  const [activeIcon, setActiveIcon] = useState(null);
  const [isTextAreaVisible, setTextAreaVisible] = useState(false);
  const [note, setNote] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false); // Track bookmark state
  const [selectedWord, setSelectedWord] = useState(null); // Store the selected word
  const [selectedMeaning, setSelectedMeaning] = useState(null); // Store the meaning of the word
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility


  useEffect(() => {
    if (user && user.id && user.role) {
      const fetchBookmarks = async () => {
        const bookmarks = await getBookmarks(user.id, user.role);
        const isCurrentAyahBookmarked = bookmarks.some(
          (b) => b.bookmarked_surah === surahId && b.bookmarked_ayah === number
        );
        setIsBookmarked(isCurrentAyahBookmarked);
      };
      fetchBookmarks();
    }
  }, [user, surahId, number]);

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
          setCurrentlyPlayingAyah(null);
          setActiveIcon(null);
          console.log(`Finished playing Ayah ${ayahNumber} in Surah ${surahId}`); // ✅ Debugging
          // ✅ Call onProgressTrack when Ayah finishes playing
          if (enableProgressTracking  && onProgressTrack) {
            console.log(`Tracking progress for Ayah ${ayahNumber} in Surah ${surahId}`);
            onProgressTrack(number);
          }
        }
      });
    } catch (error) {
      alert('Error playing audio.');
    }
  };

  const handleIconPress = async (icon) => {
    if ((!user || !user.id || !user.role) && icon !== 'play') {
      alert('Please log in to use this feature.');
      return;
    }

    setActiveIcon(icon === activeIcon ? null : icon);

    if (icon === 'bookmark') {
      const response = await toggleBookmark(user.id, user.role, surahId, number);
      if (response) {
        setIsBookmarked(response.bookmarked);
  
        // If unbookmarked, remove from the bookmarked list dynamically
        if (!response.bookmarked && removeBookmark) {
          removeBookmark(surahId, number);
          fetchBookmarkedAyahs();
        }
      }
      return;
    }
    

    if (icon === 'play') {
      const ayahKey = `${surahId.toString().padStart(3, '0')}${number.toString().padStart(3, '0')}`;
      if (currentlyPlayingAyah && currentlyPlayingAyah !== ayahKey) {
        setActiveIcon(null);
        alert('Please stop the currently playing Ayah before playing another one.');
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

  // Handle Long Press on Word
  const handleWordLongPress = (word, index) => {

    console.log(`Word ${index + 1} long pressed:`, word); // ✅ Debugging
    if (!word || word.length <= 1) return; // ✅ Skip single-letter words for mapping

    // Ensure we are only looking up valid words
    const filteredIndex = mappedWords.indexOf(word); // ✅ Get index from mapped list
    if (filteredIndex === -1) return; // ✅ Prevent mapping single-letter words

    const key = `${surahId}:${number}:${filteredIndex + 1}:1`; // Construct key for translation lookup
    const meaning = wordMeanings[key] || "Translation not available"; // Fetch meaning

    setSelectedWord(word);
    setSelectedMeaning(meaning);
    setIsModalVisible(true);
  };

  return (
    <>
      <View style={styles.rowContainer}>
        <View style={styles.numberCircle}>
          <Text style={styles.numberText}>{number}</Text>
        </View>

        {/* Icons */}
        <View style={styles.iconsContainer}>
          <TouchableOpacity testID="note-icon" style={[styles.iconWrapper, activeIcon === 'note' && styles.activeIconWrapper]} onPress={() => handleIconPress('note')}>
            <NoteIcon />
          </TouchableOpacity>
          <TouchableOpacity testID="play-icon" style={[styles.iconWrapper, activeIcon === 'play' && styles.activeIconWrapper]} onPress={() => handleIconPress('play')}>
            <PlayIcon />
          </TouchableOpacity>
          <TouchableOpacity testID="bookmark-icon" style={[styles.iconWrapper, isBookmarked && styles.activeIconWrapper]} onPress={() => handleIconPress('bookmark')}>
            <BookmarkIcon filled={isBookmarked} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Ayah with Translation */}
      {/* Ayah with Long Press Word Selection */}
      <View style={styles.ayahContainer}>
        <Text style={styles.arabicAyahText}>
          {allWords.map((word, index) => (
            <Text 
              key={index} 
              onLongPress={() => handleWordLongPress(word, index)} 
              style={styles.wordText}
              selectable={false} // ✅ Prevents selection
              suppressHighlighting={true} // ✅ Removes long-press highlight
            >
              {word} {' '}
            </Text>
          ))}
        </Text>
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
          textAlignVertical="top"
        />
      )}

      {/* Modal to Display Word Meaning */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Word Meaning</Text>
            <Text style={styles.selectedWord}>{selectedWord}</Text>
            <Text style={styles.meaningText}>{selectedMeaning}</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
      fontFamily:'NotoNaskhArabic-Regular',
      color: 'black', // Darker color for Arabic text
      textAlign: 'center',
      marginBottom: responsiveMargin(20), // Space between Arabic and English text
    },
    englishAyahText: {
      alignSelf: 'flex-start',
      fontSize: responsiveFontSize(14),
      marginBottom: responsiveMargin(20), // Space between Arabic and English text
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
    wordText: {
      fontSize: responsiveFontSize(18),
      fontWeight: '600',
      color: 'black',
      textAlign: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: responsiveMargin(20),
      borderRadius: 10,
      width: '80%',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: responsiveFontSize(20),
      fontWeight: 'bold',
      marginBottom: responsiveMargin(10),
    },
    selectedWord: {
      fontSize: responsiveFontSize(18),
      fontWeight: '600',
      fontFamily: 'NotoNaskhArabic-Regular',
      color: '#4E240D',
    },
    meaningText: {
      fontSize: responsiveFontSize(16),
      color: '#333',
      marginTop: responsiveMargin(10),
    },
    closeButton: {
      backgroundColor: '#BC6C25',
      paddingVertical: responsiveMargin(10),
      paddingHorizontal: responsiveMargin(20),
      marginTop: responsiveMargin(20),
      borderRadius: 5,
    },
    closeText: {
      fontSize: responsiveFontSize(14),
      color: 'white',
    },
    
  });
  