import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { width, height, responsiveIconSize, responsiveMargin, responsiveFontSize, ProfileBox, globalStyles, NoteIcon } from '../styles/globalStyles';
import { LinearGradient } from 'expo-linear-gradient'; // Import from expo-linear-gradient
import {Svg, Path} from 'react-native-svg';
import React from 'react'

export default function UllamaDescriptionScreen({ navigation, route }) {

  const { ulama } = route.params; // Get the passed 
  
  const handleBookAppointment = () =>{
    console.log('Process Button Pressed');
    navigation.navigate('BookAppointment');
    console.log('Navigated to Book Appointment Screen'); 
  }

  return (
    <View style={[globalStyles.container, {backgroundColor: '#F0DEAE'}]}>

    <LinearGradient colors={['#FDFBF8', '#F5E7CD','#EED5A8', '#E0BA76', '#DEB260']} style={{width: width, borderBottomLeftRadius:40, borderBottomRightRadius:40}}>
        {/* Back Button */}
        <View style={globalStyles.headerContainer}>
            <View style={globalStyles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../assets/images/Back_Icon.png')}
                        style={[globalStyles.icon, globalStyles.backIcon]}
                    />
                </TouchableOpacity>
            </View>
        </View>
        {/* Doctor's Image and Name */}
        <View style={styles.header}>
            <View style={styles.profilePicture}>
                <Image
                    source={require('../assets/images/Set_Picture.png')} 
                    style={styles.profileImage}
                />
            </View>
            <Text style={styles.doctorName}>{ulama.name}</Text>
            <Text style={styles.specialty}>{ulama.expertise}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
            <View style={styles.statBox}>
                <View style={styles.statIcon}>
                    <NoteIcon></NoteIcon>
                </View>
                <View style={{padding:14, alignItems:'center'}}>
                    <Text style={styles.statValue}>1000+</Text>
                    <Text style={styles.statLabel}>Patients</Text>
                </View>
            </View>
            <View style={styles.statBox}>
                <View style={styles.statIcon}>
                        <NoteIcon></NoteIcon>
                    </View>
                    <View style={{padding:14, alignItems:'center'}}>
                        <Text style={styles.statValue}>10 Yrs</Text>
                        <Text style={styles.statLabel}>Experience</Text>
                    </View>
                </View>
            <View style={styles.statBox}>
                <View style={styles.statIcon}>
                    <NoteIcon></NoteIcon>
                </View>
                <View style={{padding:14, alignItems:'center'}}>
                    <Text style={styles.statValue}>4.5</Text>
                    <Text style={styles.statLabel}>Ratings</Text>
                </View>
            </View>
        </View>
    </LinearGradient>
    <ScrollView style={styles.container}>
      
      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Ullama</Text>
        <Text style={styles.sectionContent}>
          {ulama.name} is a top scholar at Pakistan. He has achieved several awards and recognition for his contribution and service in his own field. He is available for private consultation.
        </Text>
      </View>

      {/* Working Time Section */}
      <View style={[styles.section, {marginTop: responsiveMargin(30)}]}>
        <Text style={styles.sectionTitle}>Working time</Text>
        <Text style={styles.sectionContent}>Mon-Sat (08:30 AM - 09:00 PM)</Text>
      </View>

      {/* Appointment Price Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appointment Price</Text>
        <View style={styles.priceRow}>
          <View style={styles.priceIcon}>
            <SessionsIcon color={'black'}
            />
          </View>
          <View style={{padding:responsiveMargin(5)}}>
            <Text style={styles.priceText}>Per Session</Text>
            <Text style={styles.priceValue}>PKR 2500</Text>
          </View>
        </View>
      </View>

      {/* Book Appointment Button */}
      <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F0DEAE',
      padding: responsiveMargin(25),
    },
    header: {
      alignItems: 'center',
    },
    profilePicture: {
        width: responsiveIconSize(100), // Diameter of the circle
        height: responsiveIconSize(100),    
        borderRadius: responsiveIconSize(50), // Makes it a circle
        borderWidth: 2,
        borderColor: '#F5E7CD', // Border color
        marginBottom: responsiveMargin(30),
        backgroundColor: '#E8F1FF', // Placeholder background color
        justifyContent: 'flex-end',
        alignItems: 'center',
        overflow: 'hidden', // Ensures the image fits within the circle
    },
    profileImage: {
        width: responsiveIconSize(80), // Adjust size slightly smaller than the container
        height: responsiveIconSize(80),
        resizeMode: 'contain', // Ensures the image covers the circle
    },
    doctorName: {
      fontSize: responsiveFontSize(17),
      marginBottom: responsiveMargin(15),
      fontWeight: 'bold',
      color: '#4E240D',
    },
    specialty: {
      fontSize: responsiveFontSize(15),
      color: '#7D7D7D',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 20,
      padding: 10,
      borderRadius: 10,
    },
    statBox: {
      alignItems: 'center',
      backgroundColor: '#F0DEAE',
      borderRadius: 17,
      margin: 10,
      flex: 1,
      height: height / 7,
    },
    statIcon:{
        backgroundColor:'#EED5A8', 
        paddingHorizontal:13,
        paddingVertical:10,
        height:height/14, 
        justifyContent:'flex-end',
        borderBottomLeftRadius:15, 
        borderBottomRightRadius:15
    },
    statValue: {
      fontSize: responsiveFontSize(13),
      marginBottom: responsiveMargin(5),
      fontWeight: 'bold',
      color: '#4E240D',
    },
    statLabel: {
      fontSize: responsiveFontSize(10),
      color: '#7D7D7D',
    },
    section: {
      marginVertical: 10,
    },
    sectionTitle: {
      fontSize: responsiveFontSize(15),
      fontWeight: 'bold',
      color: '#4E240D',
    },
    sectionContent: {
      fontSize: responsiveFontSize(13),
      color: '#7D7D7D',
      lineHeight: 20,
      marginVertical: responsiveMargin(15),
    },
    priceIcon:{
      backgroundColor:'#EED5A8', paddingLeft:responsiveMargin(16), paddingRight:responsiveMargin(10), paddingVertical:10, marginRight:5, borderRadius:15
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: responsiveMargin(20),
    },
    sessionIcon: {
      width: responsiveIconSize(20),
      height: responsiveIconSize(20),
    },
    priceText: {
      fontSize: responsiveFontSize(15),
      color: '#7D7D7D',
      marginBottom: responsiveMargin(5),
    },
    priceValue: {
      fontSize: responsiveFontSize(12),
      fontWeight: 'bold',
      color: '#4E240D',
    },
    bookButton: {
      backgroundColor: '#BC6C25',
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 30,
    },
    bookButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFF',
    },
  });

  const SessionsIcon = () => (
    <View style={{ marginTop: responsiveMargin(4) }}>
      <Svg width="25" height="25" viewBox="0 0 25 25" fill="none">
        <Path
          d="M10.0007,0 C12.6497,0 15.1997,1.05 17.0697,2.93 C18.9497,4.811 20.0007,7.35 20.0007,10.01 C20.0007,13.51 18.1597,16.76 15.1597,18.57 C12.1597,20.38 8.4297,20.48 5.3307,18.83 L5.3307,18.83 L5.2997,18.83 C5.0007,18.71 4.7597,18.5 4.4797,18.36 C4.1707,18.23 3.8197,18.21 3.5007,18.311 C2.7597,18.57 2.0097,18.78 1.2397,18.96 C0.8397,18.97 0.7197,18.73 0.7197,18.34 C0.8997,17.55 1.1397,16.769 1.4207,16.01 C1.5297,15.68 1.5007,15.33 1.3307,15.019 L1.3307,15.019 L1.1307,14.63 C0.3897,13.22 0.0007,11.65 0.0007,10.061 L0.0007,10.061 L0.0007,10 C0.0007,7.35 1.0497,4.8 2.9297,2.93 C4.8097,1.05 7.3497,0 10.0007,0 Z M14.6097,8.73 C13.9097,8.73 13.3307,9.3 13.3307,10.01 C13.3307,10.71 13.9097,11.29 14.6097,11.29 C15.3197,11.29 15.8897,10.71 15.8897,10.01 C15.8897,9.3 15.3197,8.73 14.6097,8.73 Z M10.0007,8.73 C9.2907,8.73 8.7197,9.3 8.7197,10.01 C8.7197,10.71 9.2907,11.29 10.0007,11.29 C10.7107,11.29 11.2797,10.71 11.2797,10.01 C11.2797,9.3 10.7107,8.73 10.0007,8.73 Z M5.3897,8.73 C4.6797,8.73 4.1097,9.3 4.1097,10.01 C4.1097,10.71 4.6797,11.29 5.3897,11.29 C6.0897,11.29 6.6707,10.71 6.6707,10.01 C6.6707,9.3 6.0897,8.73 5.3897,8.73 Z"
          fill='#BC6C25' // Change color based on focus
        />
      </Svg>
    </View>
  );