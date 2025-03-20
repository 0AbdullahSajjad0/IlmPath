import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ImageBackground, StyleSheet } from 'react-native';
import { width, height, responsiveMargin, responsiveFontSize, globalStyles } from '../styles/globalStyles';
import RowWithAyah from '../helpers/RowWithAyah';

const QuranData = require('../assets/data/QuranDataInJson.json');

export default function ChatbotResultScreen({ navigation, route }) {
  const { extractedReferences } = route.params || {};

  console.log('Extracted Ayah References in results screen:', extractedReferences);

  if (!Array.isArray(extractedReferences) || extractedReferences.length === 0) {
    return (
      <View style={[globalStyles.container, { backgroundColor: '#F0DEAE', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>No matching Ayahs found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Group Ayahs by Surah
  const surahGroups = extractedReferences.reduce((acc, { surah_no, ayah_no }) => {
    const matchingAyah = QuranData.find(ayah => ayah.surah_no === surah_no && ayah.ayah_no_surah === ayah_no);
    if (matchingAyah) {
      if (!acc[surah_no]) acc[surah_no] = [];
      acc[surah_no].push(matchingAyah);
    }
    return acc;
  }, {});

  return (
    <View style={[globalStyles.container, { backgroundColor: '#F0DEAE' }]}>
      {/* Header */}
      <View style={globalStyles.headerContainer}>
        <View style={globalStyles.backButtonContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/images/Back_Icon.png')}
              style={[globalStyles.icon, globalStyles.backIcon]}
            />
          </TouchableOpacity>
          <Text style={[globalStyles.subtitle, globalStyles.backText]}>Search Results</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[globalStyles.formContainer, { marginTop: responsiveMargin(20) }]} showsVerticalScrollIndicator={false}>
        {Object.entries(surahGroups).map(([surah_no, ayahs]) => {
          const surahInfo = QuranData.find(surah => surah.surah_no === parseInt(surah_no));
          if (!surahInfo) return null;

          return (
            <View key={surah_no}>
              {/* Surah Description Box */}
              <ImageBackground 
                source={require('../assets/images/Surah_Background.png')} 
                style={styles.backgroundImage}
                resizeMode="contain"
              >
                <View style={styles.gradientBackground}>
                  {/* Surah Title in Roman and English */}
                  <Text style={styles.title}>{surahInfo.surah_name_roman}</Text>
                  <Text style={styles.arabicText}>{surahInfo.surah_name_en}</Text>
                  {/* Horizontal Line */}
                  <View style={styles.horizontalLine} />
                  {/* Place and Ayahs Info */}
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.detailsText}>{surahInfo.place_of_revelation}</Text>
                    <Text style={styles.detailsText}>. {surahInfo.total_ayah_surah} Ayat</Text>
                  </View>
                </View>
              </ImageBackground>

              {/* Ayahs for this Surah */}
              {ayahs.map((ayah) => {
              const extractWords = (wordString) => {
                if (!wordString || typeof wordString !== 'string') return { allWords: [], mappedWords: [] };

                const allWords = wordString
                  .replace(/[\[\]"]/g, '')  // Remove brackets and quotes
                  .split(',')               // Split into words
                  .map(word => word.trim()); // Trim spaces

                const mappedWords = allWords.filter(word => word.length > 1); // ✅ Remove single-letter words for mapping

                return { allWords, mappedWords };
              };

              const { allWords, mappedWords } = extractWords(ayah.list_of_words);

              return (
                <RowWithAyah
                  key={ayah.ayah_no_quran}
                  number={ayah.ayah_no_surah}
                  arabicText={ayah.ayah_ar}
                  englishText={ayah.ayah_en}
                  surahId={ayah.surah_no}
                  allWords={allWords} // ✅ Use for display
                  mappedWords={mappedWords} // ✅ Use for meaning lookup only
                />
              );
            })}

            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    paddingVertical: responsiveMargin(30),
    marginVertical: responsiveMargin(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: responsiveFontSize(24),
    fontWeight: '400',
    marginBottom: responsiveMargin(20),
    color: 'white',
  },
  arabicText: {
    fontSize: responsiveFontSize(18),
    color: 'white',
  },
  detailsText: {
    fontSize: responsiveFontSize(16),
    color: 'white',
  },
  horizontalLine: {
    width: width / 2.4, 
    height: 2, 
    backgroundColor: 'white', 
    color: 'white',
    borderWidth: 1, 
    borderRadius: 1, 
    borderColor: 'white', 
    alignSelf: 'center', 
    marginVertical: responsiveMargin(20), 
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  goBackButton: {
    backgroundColor: '#BC6C25',
    paddingVertical: responsiveMargin(10),
    paddingHorizontal: responsiveMargin(20),
    marginTop: responsiveMargin(20),
  },
  goBackText: {
    fontSize: responsiveFontSize(14),
    color: 'white',
  },
});
