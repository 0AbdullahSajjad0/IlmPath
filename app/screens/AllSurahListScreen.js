import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, Image, ImageBackground, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { width, height, responsiveIconSize, responsiveMargin, responsiveFontSize, SurahBox, globalStyles } from '../styles/globalStyles';
import QuranData from '../assets/data/QuranDataInJson.json';

export default function AllSurahListScreen({ navigation }) {

  const [surahData, setSurahData] = useState([]);
  useEffect(() => {
    // Create a Map to store unique surahs
    const surahMap = new Map();
  
    // Iterate over the QuranData
    QuranData.forEach((entry) => {
      const surahNo = parseInt(entry.surah_no);
      // Check if surahNo is between 1 and 5 and not already in the map
      if (surahNo >= 1 && surahNo <= 114 && !surahMap.has(surahNo)) {
        surahMap.set(surahNo, entry);
      }
    });
  
    // Convert the map values to an array
    const firstFiveSurahs = Array.from(surahMap.values());
  
    // Update the state with the unique surahs
    setSurahData(firstFiveSurahs);
  }, []);

  return (
    <View style={[globalStyles.container, {backgroundColor: '#F0DEAE'}]}>

        {/* Back Button */}
        <View style={globalStyles.headerContainer}>
            <View style={globalStyles.backButtonContainer}>
                <Image
                    source={require('../assets/images/Back_Icon.png')}
                    style={[globalStyles.icon, globalStyles.backIcon]}
                />
                <Text style={[globalStyles.subtitle, globalStyles.backText]}>Surah List</Text>
            </View>
        </View>

        <ScrollView
          contentContainerStyle={[globalStyles.formContainer, {marginTop: responsiveMargin(20)}]}
          showsVerticalScrollIndicator={false}
        >
            
            {/* Surah Boxes */}
            {surahData.map((surah, index) => (
            <SurahBox
                key={index}
                id={surah.surah_no} // Use surah_no or another unique identifier
                arabicName={surah.surah_name_ar}
                romanName={surah.surah_name_roman}
                place={surah.place_of_revelation}
                totalAyahs={surah.total_ayah_surah}
                onPress={(id) => navigation.navigate('ReadSurah', { surahId: id })}
            />
            ))}

        </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 20,
    color: 'white',
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
