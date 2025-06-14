import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ImageBackground, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // ✅ Import useFocusEffect
import { width, responsiveMargin, responsiveFontSize, globalStyles } from '../styles/globalStyles';
import RowWithAyah from '../helpers/RowWithAyah';
import { getBookmarks } from '../services/bookmarkService';
import { useUser } from '../../context/UserContext';

const QuranData = require('../assets/data/QuranDataInJson.json');

export default function AllBookmarkedSurahScreen({ navigation }) {
  const { user } = useUser();
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState([]);

  // ✅ Fetch bookmarks on screen focus
  useFocusEffect(
    useCallback(() => {
      const fetchBookmarkedAyahs = async () => {
        if (user && user.id && user.role) {
          const bookmarks = await getBookmarks(user.id, user.role);
          setBookmarkedAyahs(bookmarks);
        }
      };
      fetchBookmarkedAyahs();
    }, [user])
  );

  // ✅ Function to remove an unbookmarked Ayah dynamically
  const removeBookmark = (surah_no, ayah_no) => {
    setBookmarkedAyahs((prev) =>
      prev.filter((ayah) => !(ayah.bookmarked_surah === surah_no && ayah.bookmarked_ayah === ayah_no))
    );
  };

  if (!Array.isArray(bookmarkedAyahs) || bookmarkedAyahs.length === 0) {
    return (
      <View style={[globalStyles.container, { backgroundColor: '#F0DEAE', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>No bookmarked Ayahs found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ✅ Group Bookmarked Ayahs by Surah
  const surahGroups = bookmarkedAyahs.reduce((acc, { bookmarked_surah, bookmarked_ayah }) => {
    const matchingAyah = QuranData.find(ayah => ayah.surah_no === bookmarked_surah && ayah.ayah_no_surah === bookmarked_ayah);
    if (matchingAyah) {
      if (!acc[bookmarked_surah]) acc[bookmarked_surah] = [];
      acc[bookmarked_surah].push(matchingAyah);
    }
    return acc;
  }, {});

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
          <Text style={[globalStyles.subtitle, globalStyles.backText]}>Bookmarked Ayahs</Text>
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
                  <Text style={styles.title}>{surahInfo.surah_name_roman}</Text>
                  <Text style={styles.arabicText}>{surahInfo.surah_name_en}</Text>
                  <View style={styles.horizontalLine} />
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.detailsText}>{surahInfo.place_of_revelation}</Text>
                    <Text style={styles.detailsText}>. {surahInfo.total_ayah_surah} Ayat</Text>
                  </View>
                </View>
              </ImageBackground>

              {/* Ayahs for this Surah */}
              {ayahs.map((ayah) => {
                const { allWords, mappedWords } = extractWords(ayah.list_of_words);

                return (
                  <RowWithAyah
                    key={ayah.ayah_no_quran}
                    number={ayah.ayah_no_surah}
                    arabicText={ayah.ayah_ar}
                    englishText={ayah.ayah_en}
                    surahId={ayah.surah_no}
                    allWords={allWords} // ✅ Arabic text display
                    mappedWords={mappedWords} // ✅ Word meanings lookup
                    removeBookmark={removeBookmark}
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
    borderRadius: 1, 
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
