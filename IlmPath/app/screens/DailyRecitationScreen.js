import React, {useState} from 'react';
import { View, Text, TextInput, Image, ImageBackground, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { width, height, responsiveIconSize, responsiveMargin, responsiveFontSize, BookmarkIcon, PlayIcon, NoteIcon, globalStyles } from '../styles/globalStyles';
import QuranData from '../assets/data/QuranDataInJson.json';
import { useUser } from '../../context/UserContext';
import { trackProgress } from '../services/progressService';
import { fetchNote, saveNote } from '../services/noteService';

const RowWithAyah = ({ number, arabicText, englishText, user, surahId, incrementedAyahs, setIncrementedAyahs  }) => {
    const [activeIcon, setActiveIcon] = useState(null); // Local state for active icon
    const [isTextAreaVisible, setTextAreaVisible] = useState(false); // State to toggle text area
    const [note, setNote] = useState(''); // State to track user input

    const iconMapping = {
        note: <NoteIcon/>, //bookmark_button
        play: <PlayIcon/>, // play_button
        bookmark: <BookmarkIcon/>, // note_button
      };

      const handleIconPress = async (icon) => {

        if (!user || !user.id || !user.role) {
          alert('Please log in to use this feature.');
          return; // Prevent further execution
        }

        if (icon === 'note') {

          if (!isTextAreaVisible) {
            // When making the text area visible, fetch the note
            const fetchedNote = await fetchNote(user, surahId, number);
            setNote(fetchedNote); // Populate the text area with the retrieved note
          } else {
            // When hiding the text area, save the note
            if (note.trim() !== '') {
              const success = await saveNote(user, surahId, number, note);
              if (success) {
                console.log('Note saved successfully!');
              } else {
                console.error('Failed to save the note.');
              }
            }
          }

          setTextAreaVisible((prev) => !prev); // Toggle text area visibility
        }
        if (icon === 'play') {
          if (!incrementedAyahs[number]) {
            // If progress for this Ayah hasn't been incremented
            try {
              await trackProgress({ user_id: user.id, role: user.role });
              setIncrementedAyahs((prev) => ({ ...prev, [number]: true })); // Mark this Ayah as incremented
              console.log(`Progress incremented for Ayah ${number}`);
            } catch (error) {
              console.error('Error incrementing progress:', error);
            }
          } else {
            console.log(`Progress for Ayah ${number} has already been incremented.`);
          }
        }
        if (activeIcon === icon) {
          setActiveIcon(null); // Remove highlight
        } else {
          setActiveIcon(icon); // Highlight the selected icon
          switch (icon) {
            case 'bookmark':
              alert('Bookmark clicked!');
              break;
            case 'play':
              alert('Play clicked!');
              break;
            default:
              //alert('Unknown action');
          }
        }
      };

    return (
      <>
        {/* Row Bar of Icons */}
        <View style={styles.rowContainer}>
            {/* Number with Circular Background */}
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

export default function DailyRecitationScreen({ navigation, route }) {
    const { user } = useUser();
    const { completedAyahs } = route.params; // Get the completedAyahs parameter
    const [incrementedAyahs, setIncrementedAyahs] = useState({}); // Track incremented Ayahs

    // Filter QuranData for the next three Ayahs
    const nextThreeAyahs = QuranData.filter(
      (ayah) => ayah.ayah_no_quran > completedAyahs + 1 // Fetch Ayahs after the completed one
    ).slice(0, 3); // Limit to the next three Ayahs
  
    if (nextThreeAyahs.length === 0) {
      return (
        <View style={globalStyles.container}>
          <Text style={styles.errorText}>No more Ayahs available.</Text>
        </View>
      );
    }

    const uniqueSurahNames = [...new Set(nextThreeAyahs.map((ayah) => ayah.surah_name_roman))].join(', ');

  if (!nextThreeAyahs) {
    return (
      <View style={globalStyles.container}>
        <Text style={styles.errorText}>Surah not found.</Text>
      </View>
    );
  }

  const bismillah = QuranData[0].ayah_ar;

  

  return (
    <View style={[globalStyles.container, {backgroundColor: '#F0DEAE'}]}>

        {/* Back Button */}
        <View style={globalStyles.headerContainer}>
            <View style={globalStyles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../assets/images/Back_Icon.png')}
                        style={[globalStyles.icon, globalStyles.backIcon]}
                    />
                </TouchableOpacity>
                <Text style={[globalStyles.subtitle, globalStyles.backText]}>Daily Recitation</Text>
            </View>
        </View>

        <ScrollView
          contentContainerStyle={[globalStyles.formContainer, {marginTop: responsiveMargin(20)}]}
          showsVerticalScrollIndicator={false}
        >
            {/* Surah Description Box */}
            <ImageBackground 
            source={require('../assets/images/Surah_Background.png')} 
            style={styles.backgroundImage}
            resizeMode="contain"
            >
                <View style={styles.gradientBackground}>
                    
                    {/* Surah Title in Roman and English */}
                    <Text style={styles.title}>Continue Reciting</Text>
                    <Text style={styles.arabicText}>{uniqueSurahNames}</Text>
                    {/* Horizontal Line */}
                    <View style={styles.horizontalLine} />

                    {/* Place and Ayahs Info */}
                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.detailsText}>{nextThreeAyahs.place_of_revelation}</Text>
                    <Text style={styles.detailsText}>Daily 3 Ayat</Text>
                    </View>

                    {/* Display the first Bismillah */}
                    <View>
                    <Text style={styles.firstAyahArabic}>{bismillah}</Text>
                    </View>
                </View>
            </ImageBackground>

            {nextThreeAyahs.map((ayah, index) => (
                <RowWithAyah
                key={ayah.ayah_no_quran}
                number={ayah.ayah_no_surah}
                arabicText={ayah.ayah_ar}
                englishText={ayah.ayah_en}
                user={user} // Pass user data here
                surahId={ayah.surah_no} 
                incrementedAyahs={incrementedAyahs}
                setIncrementedAyahs={setIncrementedAyahs}
                />
            ))}            


        </ScrollView>

    </View>
  );
}

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
