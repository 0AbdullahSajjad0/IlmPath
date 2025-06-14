import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, Image, ImageBackground, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { width, height, responsiveIconSize, responsiveMargin, responsiveFontSize, BookmarkIcon, PlayIcon, NoteIcon, globalStyles } from '../styles/globalStyles';
import QuranData from '../assets/data/QuranDataInJson.json';
import { useUser } from '../../context/UserContext';
import { trackProgress } from '../services/progressService';
import RowWithAyah from '../helpers/RowWithAyah';

export default function DailyRecitationScreen({ navigation, route }) {
    const { user } = useUser();
    const { completedAyahs } = route.params; // Get the completedAyahs parameter
    const [currentlyPlayingAyah, setCurrentlyPlayingAyah] = useState(null);
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

  const extractWords = (wordString) => {
    if (!wordString || typeof wordString !== 'string') return { allWords: [], mappedWords: [] };

    const allWords = wordString
      .replace(/[\[\]"]/g, '')  
      .split(',')
      .map(word => word.trim());

    const mappedWords = allWords.filter(word => word.length > 1); 

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

            {/* Ayahs for this Surah */}  
            {nextThreeAyahs.map((ayah) => {
          const { allWords, mappedWords } = extractWords(ayah.list_of_words);

          return (
            <RowWithAyah
              key={ayah.ayah_no_quran}
              number={ayah.ayah_no_surah}
              arabicText={ayah.ayah_ar}
              englishText={ayah.ayah_en}
              surahId={ayah.surah_no}
              allWords={allWords} // ✅ For displaying full Arabic text
              mappedWords={mappedWords} // ✅ For word meanings lookup
              currentlyPlayingAyah={currentlyPlayingAyah}
              setCurrentlyPlayingAyah={setCurrentlyPlayingAyah}
              enableProgressTracking={true}
              onProgressTrack={async (ayahNumber) => {
                if (!incrementedAyahs[ayahNumber]) {
                  await trackProgress({ user_id: user.id, role: user.role });
                  setIncrementedAyahs((prev) => ({ ...prev, [ayahNumber]: true }));
                }
              }}
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
