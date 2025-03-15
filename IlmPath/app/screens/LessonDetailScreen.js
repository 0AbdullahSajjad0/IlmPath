import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Audio } from 'expo-av'; // ✅ Import Audio from expo-av
import { ProgressBar } from 'react-native-paper'; // ✅ Import ProgressBar
import { width, responsiveMargin, responsiveIconSize, responsiveFontSize, globalStyles } from '../styles/globalStyles';
import { useRoute } from '@react-navigation/native';
import { audioFiles } from '../helpers/QaidahAudioFiles';

// Import all lesson files
const lessonDataFiles  = {
  1: require('../assets/data/Qaidah/Lesson1.json'),
  2: require('../assets/data/Qaidah/Lesson2.json'),
  3: require('../assets/data/Qaidah/Lesson3.json'),
  4: require('../assets/data/Qaidah/Lesson4.json'),
  5: require('../assets/data/Qaidah/Lesson5.json'),
  6: require('../assets/data/Qaidah/Lesson6.json'),
  7: require('../assets/data/Qaidah/Lesson7.json'),
  8: require('../assets/data/Qaidah/Lesson8.json'),
  9: require('../assets/data/Qaidah/Lesson9.json'),
  10: require('../assets/data/Qaidah/Lesson10.json'),
};

const MAX_COLUMNS = 4; // ✅ Max elements per row
const MAX_ROWS = 3; // ✅ Max rows visible at a time

export default function LessonDetailScreen({ navigation }) {
    const route = useRoute();
    const { lessonId } = route.params; 
    const lessonData = lessonDataFiles[lessonId] || {}; 
    const lessonEntries = Object.entries(lessonData); 

    const [currentPage, setCurrentPage] = useState(0);
    const [playingItem, setPlayingItem] = useState(null); // Track playing item
    const [sound, setSound] = useState(null); // Store audio instance

    const totalPages = Math.ceil(lessonEntries.length / (MAX_COLUMNS * MAX_ROWS));
    const safeTotalPages = Math.max(1, totalPages);
    // Force progress to have at most 2 decimals
    const rawProgress = (currentPage + 1) / safeTotalPages;
    const progress = Number(rawProgress.toFixed(1));




    useEffect(() => {
        console.log(`Loaded Lesson ${lessonId} Data:`, lessonData);
    }, [lessonId]);

    useEffect(() => {
        return sound
            ? () => {
                  console.log('Unloading Sound');
                  sound.unloadAsync();
              }
            : undefined;
    }, [sound]);

    // ✅ Function to get paginated elements for the current page
    const getPaginatedData = () => {
        const startIndex = currentPage * (MAX_COLUMNS * MAX_ROWS);
        const endIndex = startIndex + (MAX_COLUMNS * MAX_ROWS);
        return lessonEntries.slice(startIndex, endIndex);
    };

    // ✅ Function to play the audio file
    const playAudio = async (itemKey) => {
        try {
            // Construct the file path
            if (!audioFiles[lessonId] || !audioFiles[lessonId][itemKey]) {
                console.warn(`Audio file not found for Lesson ${lessonId}, Item ${itemKey}`);
                return;
            }

            // Stop any currently playing audio
            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
            }

            // Load and play new sound
            const { sound: newSound } = await Audio.Sound.createAsync(audioFiles[lessonId][itemKey]);
            setSound(newSound);
            setPlayingItem(itemKey); // Highlight the playing item

            await newSound.playAsync();

            // Reset the playing effect when audio finishes
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setPlayingItem(null);
                }
            });
        } catch (error) {
            console.error('Error playing audio:', error);
            setPlayingItem(null);
        }
    };

    return (
        <View style={[globalStyles.container, { backgroundColor: '#F0DEAE', flex: 1 }]}>
            {/* Header */}
            <View style={globalStyles.headerContainer}>
                <View style={globalStyles.backButtonContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={require('../assets/images/Back_Icon.png')}
                            style={[globalStyles.icon, globalStyles.backIcon]}
                        />
                    </TouchableOpacity>
                    <Text style={[globalStyles.subtitle, globalStyles.backText]}>
                        Lesson {lessonId}
                    </Text>
                </View>
            </View>

            {/* Content Section with Flex Layout */}
            <View style={styles.contentContainer}>
                {/* Progress Bar Section (Top) */}
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>Progress</Text>
                    <ProgressBar progress={progress} color="#4E240D" style={[styles.progressBar, { width: Math.round(width / 1.5), height: Math.round(responsiveIconSize(8)) } ]} />
                </View>

                {/* Grid Layout (Middle) */}
                <View style={styles.gridWrapper}>
                    <View style={styles.gridContainer}>
                        {getPaginatedData().map(([key, value], index) => (
                            <TouchableOpacity 
                                key={index} 
                                style={[
                                    styles.gridItem, 
                                    playingItem === key && styles.playingItem
                                ]}
                                onPress={() => playAudio(key)}
                            >
                                <Text style={styles.gridText}>{value}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Pagination Controls (Bottom) */}
                <View style={styles.paginationContainer}>
                    <TouchableOpacity
                        onPress={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                        style={[styles.pageButton, currentPage === 0 && styles.disabledButton]}
                    >
                        <Text style={styles.pageButtonText}>Prev</Text>
                    </TouchableOpacity>

                    <Text style={styles.pageIndicator}>
                        Page {currentPage + 1} / {totalPages}
                    </Text>

                    <TouchableOpacity
                        onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                        disabled={currentPage === totalPages - 1}
                        style={[styles.pageButton, currentPage === totalPages - 1 && styles.disabledButton]}
                    >
                        <Text style={styles.pageButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
  const styles = StyleSheet.create({
  contentContainer: {
    flex: 1, // ✅ Ensures content stretches to fill available space
    justifyContent: 'space-between', // ✅ Pushes progress to top, grid in middle, pagination to bottom
    paddingHorizontal: responsiveMargin(20),
    paddingVertical: responsiveMargin(10),
  },

  progressContainer: {
    flex: 1, // ✅ Smallest weight, keeps it at the top
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressText: {
    fontSize: responsiveFontSize(14),
    color: '#4E240D',
    fontWeight: 'bold',
    marginBottom: responsiveMargin(20),
  },

  progressBar: {
    borderRadius: 5,
    color: '#4E240D',
  },

  gridWrapper: {
    flex: 4, // ✅ Most space, keeps it in the middle
    justifyContent: 'center',
    alignItems: 'center', 
  },

  gridContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  gridItem: {
    width: width / 5,
    height: width / 5,
    margin: responsiveMargin(5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F1FF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  playingItem: {
    transform: [{ scale: 1.1 }], // ✅ Slightly zoom in when playing
    backgroundColor: '#BC6C25', // ✅ Change color to indicate playing
},
  gridText: {
    fontSize: responsiveFontSize(16),
    fontFamily:'NotoNaskhArabic-Regular',
    color: '#4E240D',
    fontWeight: 'bold',
  },

  paginationContainer: {
    flex: 1, // ✅ Keeps pagination at the bottom
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveMargin(10),
    paddingHorizontal: responsiveMargin(40),
  },

  pageButton: {
    backgroundColor: '#BC6C25',
    paddingVertical: responsiveMargin(8),
    paddingHorizontal: responsiveMargin(14),
    borderRadius: 10,
  },

  pageButtonText: {
    color: 'white',
    fontSize: responsiveFontSize(14),
    fontWeight: 'bold',
  },

  disabledButton: {
    backgroundColor: '#999',
  },

  pageIndicator: {
    fontSize: responsiveFontSize(14),
    fontWeight: 'bold',
    color: '#4E240D',
  },
});
