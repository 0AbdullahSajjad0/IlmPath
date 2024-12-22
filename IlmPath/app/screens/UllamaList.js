import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, Image, ImageBackground, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { width, height, responsiveIconSize, responsiveMargin, responsiveFontSize, ProfileBox, globalStyles } from '../styles/globalStyles';
import QuranData from '../assets/data/QuranDataInJson.json';
import { fetchAllUlama } from '../services/ullamaService';

export default function UllamaList({ navigation }) {

    const [ulamaList, setUlamaList] = useState([]); // State to store Ulama data

    const handleUllamaDescriptionPress = (ulama) => {
      // Navigate to the description screen with selected Ulama details
      console.log('Ullama selected:', ulama);
      navigation.navigate('UllamaDescription', { ulama: ulama });
    };

    useEffect(() => {
      const getUlamaList = async () => {
        const fetchedUlama = await fetchAllUlama();
        setUlamaList(fetchedUlama);
      };
  
      getUlamaList();
    }, []);

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
                    <Text style={[globalStyles.subtitle, globalStyles.backText]}>Ullama</Text>
                </View>
            </View>
    
            <ScrollView
              contentContainerStyle={[globalStyles.formContainer]}
              showsVerticalScrollIndicator={false}
            >
                
              {/* Ulama Profile Boxes */}
              {ulamaList.length > 0 ? (
                ulamaList.map((ulama, index) => (
                  <ProfileBox
                    key={index}
                    name={ulama.name}
                    expertise={ulama.expertise}
                    picture={ulama.profileImage || require('../assets/images/Set_Picture.png')} 
                    onPress={() => handleUllamaDescriptionPress(ulama)}
                  />
                ))
              ) : (
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                  No Ulama available at the moment.
                </Text>
              )}
    
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
  