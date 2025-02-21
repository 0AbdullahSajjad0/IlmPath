import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import {
  responsiveMargin,
  responsiveFontSize,
  responsiveIconSize,
  SearchIcon,
  globalStyles,
} from '../styles/globalStyles';

export default function ChatbotScreen({ navigation }) {
  return (
    <View style={[globalStyles.container, { backgroundColor: '#F0DEAE' }]}>
      {/* Top Section: Header */}
      <View style={styles.topSection}>
        <View style={globalStyles.headerContainer}>
          <View style={globalStyles.backButtonContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../assets/images/Back_Icon.png')}
                style={[globalStyles.icon, globalStyles.backIcon]}
              />
            </TouchableOpacity>
            <Text style={[globalStyles.backText, globalStyles.subtitle]}>
              Quranic Chatbot
            </Text>
          </View>
        </View>
      </View>

      {/* Middle Section: Logo and Texts */}
      <View style={styles.middleSection}>
        <Image
          source={require('../assets/images/QuranLogo.png')} // Update with your logo's path
          style={styles.logo}
        />
        <Text style={styles.middleText1}>Welcome to Our Quranic Chatbot</Text>
        <Text style={styles.middleText1}>Write a Query and get the Answers in the light </Text>
        <Text style={styles.middleText1}>of The Holy Quran</Text>
      </View>

      {/* Bottom Section: Input Field with a Round Button */}
      <View style={styles.bottomSection}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={styles.roundButton}
            onPress={() => console.log('Round button pressed!')}
          >
            {/* Dummy icon (you can replace with an Image or Icon component) */}
            <SearchIcon/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Top Section styling (header)
  topSection: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    paddingHorizontal: responsiveMargin(10),
    paddingTop: responsiveMargin(10),
  },
  // Middle Section styling (logo and texts)
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveMargin(20),
  },
  logo: {
    width: responsiveIconSize(150),
    height: responsiveIconSize(150),
    resizeMode: 'contain',
    marginBottom: responsiveMargin(10),
  },
  middleText1: {
    fontSize: responsiveFontSize(14),
    paddingHorizontal: responsiveMargin(20),
    textAlign: 'center',
    color: '#333',
    marginBottom: responsiveMargin(5),
    marginVertical: responsiveMargin(10),
    fontFamily: 'Jost-SemiBold',
  },
  // Bottom Section styling (input field with round button)
  bottomSection: {
    paddingHorizontal: responsiveMargin(20),
    paddingBottom: responsiveMargin(30),
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: responsiveMargin(15),
    paddingVertical: responsiveMargin(12),
    marginBottom: responsiveMargin(15),
    backgroundColor: '#fff',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow for Android
    elevation: 5,
  },
  input: {
    flex: 1,
    paddingVertical: responsiveMargin(10),
    fontSize: responsiveFontSize(14),
    color: '#333',
  },
  roundButton: {
    backgroundColor: '#BC6C25',
    borderRadius: responsiveIconSize(10), // For a circular button (half of width/height)
    width: responsiveIconSize(40),
    height: responsiveIconSize(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: responsiveMargin(10),
  },
  buttonIcon: {
    fontSize: responsiveFontSize(18),
    color: '#fff',
  },
});
