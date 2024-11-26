import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { width, height, responsiveMargin, responsiveFontSize, responsiveIconSize, globalStyles, SurahBox } from '../styles/globalStyles';
import { ProgressBar } from 'react-native-paper'; // Import ProgressBar from react-native-paper

const QuranData = require('../assets/data/QuranDataInJson.json');

export default function HomeScreen({ navigation }) {
  
  const [surahData, setSurahData] = useState([]);

  useEffect(() => {
    // Create a Map to store unique surahs
    const surahMap = new Map();
  
    // Iterate over the QuranData
    QuranData.forEach((entry) => {
      const surahNo = parseInt(entry.surah_no);
      // Check if surahNo is between 1 and 5 and not already in the map
      if (surahNo >= 1 && surahNo <= 5 && !surahMap.has(surahNo)) {
        surahMap.set(surahNo, entry);
      }
    });
  
    // Convert the map values to an array
    const firstFiveSurahs = Array.from(surahMap.values());
  
    // Update the state with the unique surahs
    setSurahData(firstFiveSurahs);
  }, []);
  
  const handleViewMorePress = () => {
    // Handle button press action
    console.log('View More Button Pressed');
    navigation.navigate('SurahList');
    console.log('Navigated to All Surah List'); 
  };
  
  return (
    <View style={[globalStyles.container, {backgroundColor: '#F0DEAE'}]}>
      <ScrollView
          contentContainerStyle={[globalStyles.formContainer, {marginTop: responsiveMargin(50)}]}
          showsVerticalScrollIndicator={false}
      >
        {/* Welcome Message */}
        <View style={styles.rowContainer}>
          <View style={[globalStyles.loginTextContainer, styles.loginTextContainer]}>
              <Text style={[globalStyles.text, {marginBottom:0}]}>Hi, Guest</Text>
              <Text style={{fontSize: responsiveFontSize(12)}}>Let's start learning</Text>
          </View>
          <View style={styles.profilePicture}>
              <Image
                  source={require('../assets/images/Set_Picture.png')} // Replace with your default profile picture path
                  style={styles.profileImage}
              />
          </View>
        </View>

        {/* Learning Progress */}
        <View style={styles.learningProgressBox}>
          <Text style={styles.learningText}>Learned today</Text>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={[styles.progressText,{fontSize: responsiveFontSize(20)}]}>46min</Text>
            <Text style={styles.progressText}> / 60min</Text>
          </View>
          
          <ProgressBar 
            progress={0.6} // 76% progress (46/60)
            color="#4E240D"
            style={styles.progressBar}
          />
        </View>

        {/* Horizontal Scrollable Boxes */}
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: responsiveMargin(20), paddingHorizontal: responsiveMargin(10) }}
        >
          {/* First Box */}
          <View style={styles.horizontalBox}>
            <View style={styles.boxTextContainer}>
              <Text style={styles.boxText}>Access the chatbot to clear a query?</Text>
              <TouchableOpacity style={styles.boxButton}>
                <Text style={styles.boxButtonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.boxImageContainer}>
              <Image
                source={require('../assets/images/horizontalBox_Picture.png')} // Replace with your image path
                style={styles.boxImage}
              />
            </View>
          </View>

          {/* Second Box */}
          <View style={styles.horizontalBox}>
            <View style={styles.boxTextContainer}>
              <Text style={styles.boxText}>Want to find a Surah from Ayah?</Text>
              <TouchableOpacity style={styles.boxButton}>
                <Text style={styles.boxButtonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.boxImageContainer}>
              <Image
                source={require('../assets/images/horizontalBox_Picture.png')} // Replace with your image path
                style={styles.boxImage}
              />
            </View>
          </View>
        </ScrollView>

        {/* Read Title and View More Button */}
        <View style={styles.rowWithButton}>
          <Text style={styles.rowText}>Start Reciting</Text>
          <TouchableOpacity style={styles.rowButton} onPress={handleViewMorePress}>
            <Text style={styles.rowButtonText}>View More</Text>
          </TouchableOpacity>
        </View>

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
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%', // Ensure it spans the full width
  },
  profilePicture: {
    width: responsiveIconSize(50), // Diameter of the circle
    height: responsiveIconSize(50),    
    borderRadius: responsiveIconSize(50), // Makes it a circle
    backgroundColor: '#E8F1FF', // Placeholder background color
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-start',
    overflow: 'hidden', // Ensures the image fits within the circle
  },
  profileImage: {
      width: responsiveIconSize(40), // Adjust size slightly smaller than the container
      height: responsiveIconSize(40),
      resizeMode: 'contain', // Ensures the image covers the circle
  },
  learningProgressBox: {
    width: width - 42,
    height: height / 8,
    justifyContent: 'center',
    marginHorizontal: responsiveMargin(20),
    padding: responsiveMargin(15),
    backgroundColor: '#BC6C25',
    borderRadius: 12,
    elevation: 3, // Adds a slight shadow (Android)
    shadowColor: '#000', // Shadow color (iOS)
    shadowOffset: { width: 0, height: 2 }, // Shadow offset (iOS)
    shadowOpacity: 0.2, // Shadow opacity (iOS)
    shadowRadius: 5, // Shadow radius (iOS)
  },
  learningText: {
    fontSize: responsiveFontSize(12), 
    marginBottom: responsiveMargin(5),
    color: 'white',
  },
  progressText: {
    marginTop: responsiveMargin(5),
    fontSize: responsiveFontSize(14),
    color: 'white',
  },
  progressBar: {
    marginTop: responsiveMargin(10),
    height: responsiveIconSize(8),
    borderRadius: 5,
    color: '#4E240D',
  },
  horizontalBox: {
    width: width / 1.4, // Adjust width for two boxes side by side
    height: height / 5,
    marginHorizontal: responsiveMargin(10),
    backgroundColor: '#E0B15E',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    flexDirection: 'row', // Arrange text/button and image horizontally
    padding: responsiveMargin(15),
    justifyContent: 'space-between', // Add spacing between items
    alignItems: 'center', // Center items vertically
  },
  boxTextContainer: {
    flex: 1, // Use left space for text and button
    justifyContent: 'center',
    marginRight: responsiveMargin(10),
  },
  boxText: {
    width: '90%', // Limit text width to 70% of the container
    fontSize: responsiveFontSize(14),
    fontWeight: '600',
    color: '#545454',
    marginBottom: responsiveMargin(40),
  },
  boxButton: {
    backgroundColor: '#BC6C25',
    borderRadius: 8,
    paddingVertical: responsiveMargin(8),
    paddingHorizontal: responsiveMargin(12),
    alignSelf: 'flex-start',
  },
  boxButtonText: {
    fontSize: responsiveFontSize(12),
    color: 'white',
  },
  boxImageContainer: {
    width: responsiveIconSize(100), // Ensure consistent width for the image
    height: responsiveIconSize(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxImage: {
    width: width / 2.7,
    height: height / 5,
    resizeMode: 'contain',
  },
  rowWithButton: {
    flex: 1, // Use the full width
    width: '100%', // Ensure it spans the full width
    flexDirection: 'row', // Arrange items horizontally
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Space between text and button
    paddingHorizontal: responsiveMargin(20), // Add padding on the sides
    marginTop: responsiveMargin(20), // Add margin on top
    marginBottom: responsiveMargin(10), // Add margin on bottom
  },
  rowText: {
    fontSize: responsiveFontSize(14), // Adjust font size
    color: '#4E240D', // Text color
    fontWeight: '600', // Bold text
  },
  rowButton: {
    backgroundColor: '#BC6C25', // Button background color
    borderRadius: 8, // Rounded corners
    paddingVertical: responsiveMargin(8), // Vertical padding
    paddingHorizontal: responsiveMargin(14), // Horizontal padding
  },
  rowButtonText: {
    fontSize: responsiveFontSize(12), // Button text size
    fontFamily: 'Jost-SemiBold', // Bold font
    color: 'white', // Button text color
  }
  
});