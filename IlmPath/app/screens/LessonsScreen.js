import React, {useState} from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { width, height, responsiveMargin, responsiveFontSize, responsiveIconSize, globalStyles, StarIcon, UnlockedIcon} from '../styles/globalStyles';


export default function LessonsScreen({ navigation }) {
    // const [data, setData] = useState([]); // Replace with actual data logic
    const [data] = useState(Array.from({ length: 10 }, (_, i) => i + 1));

    return (
    <View style={[globalStyles.container, { backgroundColor: '#F0DEAE' }]}>
        {/* Heading */}
        <View style={globalStyles.headerContainer}>
            <View style={globalStyles.backButtonContainer}>
                <Text style={[globalStyles.subtitle, globalStyles.backText]}>Lessons</Text>
            </View>
        </View>
        <ScrollView
            contentContainerStyle={[
                globalStyles.formContainer,
                {  flexGrow: 1 },
            ]}
            showsVerticalScrollIndicator={false}
            >
            {data.map((id) => (
                <LessonBox key={id} id={id} onPress={(lessonId) => navigation.navigate('LessonDetailScreen', { lessonId })}/>
            ))}
        </ScrollView>
    </View>
  )
}

const LessonBox = ({ id, onPress }) => (
  <TouchableOpacity style={{width:width}} onPress={() => onPress(id)}>
    <View style={styles.verticalLineAndBoxContainer}>
      {/* Vertical Line */}
      <View style={styles.verticalLine}></View>

      {/* Box */}
      <View style={styles.infoBox}>
        {/* Left Section (Icon and Numeric Text) */}
        <View style={styles.iconAndNumberContainer}>
            <StarIcon />
            <Text style={styles.numberInsideIcon}>{id}</Text>
        </View>

        {/* Middle Section (Three Texts) */}
        <View style={styles.textContainer}>
          <Text style={styles.topText}>Lesson {id}</Text>
        </View>

        {/* Right Section (Arabic Text) */}
        <View style={styles.arabicText}>
            <UnlockedIcon />
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

  const styles = StyleSheet.create({
    verticalLineAndBoxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: responsiveMargin(10),
      marginHorizontal: responsiveMargin(20),
    },
    verticalLine: {
      width: responsiveIconSize(6), // Thickness of the vertical line
      borderRadius: 5, // Rounded corners
      height: height / 12.5, // Height of the vertical line
      backgroundColor: '#4E240D', // Color of the vertical line
      marginRight: responsiveMargin(10), // Spacing between the line and the box
    },
    infoBox: {
      flex: 1, // Take up remaining space
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#E8F1FF', // Box background color
      borderRadius: 12,
      padding: responsiveMargin(15),
      elevation: 3, // Shadow for Android
      shadowColor: '#000', // Shadow color for iOS
      shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
      shadowOpacity: 0.2, // Shadow opacity for iOS
      shadowRadius: 5, // Shadow radius for iOS
    },
    iconAndNumberContainer: {
      width: responsiveIconSize(36), // Adjust based on your icon size
      height: responsiveIconSize(36), 
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative', // Allow the text to overlay the icon
    },
    iconStyle: {
      width: '100%', // Fill the container
      height: '100%',
      resizeMode: 'contain', // Keep aspect ratio
    },
    numberInsideIcon: {
      position: 'absolute', // Position the number on top of the icon
      fontSize: responsiveFontSize(12),
      fontWeight: 'bold',
      color: '#4E240D', // Ensure contrast
    },
    numberText: {
      fontSize: responsiveFontSize(20),
      fontWeight: 'bold',
      color: '#4E240D',
    },
    textContainer: {
      flex: 1, // Take up remaining space in the middle
      paddingLeft: responsiveMargin(10),
    },
    topText: {
      fontSize: responsiveFontSize(14),
      fontWeight: '600',
      color: '#4E240D',
      marginBottom: responsiveMargin(5),
    },
    bottomText: {
      fontSize: responsiveFontSize(12),
      color: '#545454',
    },
    arabicText: {
      fontSize: responsiveFontSize(16),
      fontWeight: 'bold',
      color: '#4E240D',
    },
    profilePicture: {
      width: responsiveIconSize(50), // Diameter of the circle
      height: responsiveIconSize(50),    
      borderRadius: responsiveIconSize(50), // Makes it a circle
      backgroundColor: '#E8F1FF', // Placeholder background color
      justifyContent: 'flex-end',
      alignItems: 'center',
      alignSelf: 'center',
      overflow: 'hidden', // Ensures the image fits within the circle
    },
    horizontalLine: {
      width: width/1.15, // Adjust to ensure it's wide enough
      height: 1, // Thin line
      backgroundColor: 'white', // Use black for visibility; adjust if needed
      color: 'white',
      borderColor: 'white', // Use black for visibility; adjust if needed
      alignSelf: 'center', // Center the line horizontally
    },
    
  });