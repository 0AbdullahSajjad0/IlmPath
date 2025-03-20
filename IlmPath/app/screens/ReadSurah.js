import React, {useState} from 'react';
import { View, Text, TextInput, Image, ImageBackground, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { width, height, responsiveIconSize, responsiveMargin, responsiveFontSize, BookmarkIcon, PlayIcon, NoteIcon, globalStyles } from '../styles/globalStyles';
import QuranData from '../assets/data/QuranDataInJson.json';
import { useUser } from '../../context/UserContext';
import RowWithAyah from '../helpers/RowWithAyah';

export default function ReadSurah({ navigation, route }) {
  const { user } = useUser();
  const { surahId } = route.params; // Get the passed surahId
  const [currentlyPlayingAyah, setCurrentlyPlayingAyah] = useState(null);
  const surahAyahs = QuranData.find((s) => parseInt(s.surah_no) === parseInt(surahId)); // Find the surah
  const surahAyahs2 = QuranData.filter((s) => {
    if (parseInt(s.surah_no) === parseInt(surahId)) {
      if (parseInt(s.surah_no) === 1) {
        return parseInt(s.ayah_no_surah) > 1; // Skip the first ayah for Surah 1
      }
      return true; // Include all ayahs for other surahs
    }
    return false; // Exclude ayahs from other surahs
  });

  if (!surahAyahs) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Surah not found.</Text>
      </View>
    );
  }

  const bismillah = QuranData[0].ayah_ar;  

  const extractWords = (wordString) => {
    if (!wordString || typeof wordString !== 'string') return [];

    // ✅ Remove unwanted characters like brackets and extra spaces
    const allWords = wordString
      .replace(/[\[\]"]/g, '')  // Remove brackets and double quotes
      .split(',')               // Split by commas
      .map(word => word.trim()) // Trim spaces

    const mappedWords = allWords.filter(word => word.length > 1); // ✅ Remove single-letter words for mapping

    return { allWords, mappedWords };
  };

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
                <Text style={[globalStyles.subtitle, globalStyles.backText]}>{surahAyahs.surah_name_roman}</Text>
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
                    <Text style={styles.title}>{surahAyahs.surah_name_roman}</Text>
                    <Text style={styles.arabicText}>{surahAyahs.surah_name_en}</Text>
                    {/* Horizontal Line */}
                    <View style={styles.horizontalLine} />

                    {/* Place and Ayahs Info */}
                    <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.detailsText}>{surahAyahs.place_of_revelation}</Text>
                    <Text style={styles.detailsText}>. {surahAyahs.total_ayah_surah} Ayat</Text>
                    </View>

                    {/* Display the first Bismillah */}
                    <View>
                    <Text style={styles.firstAyahArabic}>{bismillah}</Text>
                    </View>
                </View>
            </ImageBackground>

            {surahAyahs2.map((ayah) => {
              const { allWords, mappedWords } = extractWords(ayah.list_of_words);

              return (
                <RowWithAyah
                  key={ayah.ayah_no_quran}
                  number={ayah.ayah_no_surah}
                  arabicText={ayah.ayah_ar}
                  englishText={ayah.ayah_en}
                  user={user} 
                  surahId={surahId}
                  allWords={allWords} // ✅ Use for display
                  mappedWords={mappedWords} // ✅ Use for meaning lookup only
                  currentlyPlayingAyah={currentlyPlayingAyah}
                  setCurrentlyPlayingAyah={setCurrentlyPlayingAyah}
                />
              );
            })}



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
    fontFamily: 'NotoNaskhArabic-Bold',
    color: 'white',
    textAlign: 'center', // Center the Ayah text
    marginBottom: 10,
  },
  
  
});
