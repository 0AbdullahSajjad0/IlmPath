import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  width,
  height,
  responsiveIconSize,
  responsiveMargin,
  responsiveFontSize,
  AttachIcon,
  MicIcon,
  globalStyles,
} from '../styles/globalStyles';

export default function OpenSessionScreen({ navigation, route }) {
  const { ulama } = route.params; // Passed parameter
  const [profileImage, setProfileImage] = useState(null);
  // Dummy state for chats; if empty, the middle section will render.
  const [chats, setChats] = useState([]);

  return (
    <View style={[globalStyles.container, { backgroundColor: '#F0DEAE' }]}>
      {/* Header with Back Button and Profile Picture */}
      <View style={globalStyles.headerContainer}>
        <View style={globalStyles.backButtonContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/images/Back_Icon.png')}
              style={[globalStyles.icon, styles.backIcon]}
            />
          </TouchableOpacity>
          <View style={styles.profilePicture}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('../assets/images/Set_Picture.png')
              }
              style={styles.profileImage}
            />
          </View>
          <Text
            style={[
              globalStyles.subtitle,
              globalStyles.backText,
              { fontSize: responsiveFontSize(16) },
            ]}
          >
            {ulama.name}
          </Text>
        </View>
      </View>

      {/* Scrollable Chat / Middle Section */}
      <ScrollView
        contentContainerStyle={[globalStyles.formContainer, { flexGrow: 1 }]}
        showsVerticalScrollIndicator={false}
      >
        {chats.length > 0 ? (
          // Render chat messages (dummy chat bubble used as an example)
          chats.map((chat, index) => (
            <View key={index} style={styles.chatBubble}>
              <Text style={styles.chatText}>{chat}</Text>
            </View>
          ))
        ) : (
          // Render Middle Section if no chats exist
          <View style={styles.middleSection}>
            <Image
              source={require('../assets/images/QuranLogo.png')}
              style={styles.logo}
            />
            <Text style={styles.middleText1}>
              Welcome to Our Quranic Chatbot
            </Text>
            <Text style={styles.middleText1}>
              Write a Query and get the Answers in the light
            </Text>
            <Text style={styles.middleText1}>of The Holy Quran</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Field at the bottom */}
      <View style={styles.inputFieldContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={styles.attachButton}
            onPress={() => console.log('Attach file pressed')}
          >
            <AttachIcon/>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.micButton}
            onPress={() => console.log('Mic pressed')}
          >
            <MicIcon/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backIcon: {
    width: responsiveIconSize(20),
    height: responsiveIconSize(20),
  },
  profileImage: {
    width: responsiveIconSize(30),
    height: responsiveIconSize(30),
    resizeMode: 'contain',
  },
  profilePicture: {
    width: responsiveIconSize(40),
    height: responsiveIconSize(40),
    borderRadius: responsiveIconSize(40),
    marginHorizontal: responsiveMargin(18),
    backgroundColor: '#E8F1FF',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveMargin(20),
  },
  logo: {
    width: responsiveIconSize(100),
    height: responsiveIconSize(100),
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
  inputFieldContainer: {
    width: '100%',
    margin: responsiveMargin(15),
    paddingHorizontal: responsiveMargin(15),
    paddingVertical: responsiveMargin(15),
    backgroundColor: '#F0DEAE',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 35,
    paddingHorizontal: responsiveMargin(15),
    paddingVertical: responsiveMargin(12),
  },
  input: {
    flex: 1,
    fontSize: responsiveFontSize(14),
    color: '#333',
  },
  attachButton: {
    marginHorizontal: responsiveMargin(15),
  },
  attachIcon: {
    width: responsiveIconSize(18),
    height: responsiveIconSize(18),
    resizeMode: 'contain',
  },
  micButton: {
    backgroundColor: '#BC6C25',
    width: responsiveIconSize(35),
    height: responsiveIconSize(35),
    borderRadius: responsiveIconSize(17.5),
    padding: responsiveMargin(10),
    justifyContent: 'center',
  alignItems: 'center',
  },
  micIcon: {
    width: responsiveIconSize(15),
    height: responsiveIconSize(15),
    resizeMode: 'contain',
  },
  chatBubble: {
    backgroundColor: '#EAC98F',
    padding: responsiveMargin(12),
    borderRadius: 8,
    marginVertical: responsiveMargin(5),
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  chatText: {
    fontSize: responsiveFontSize(14),
    color: '#4E240D',
    fontFamily: 'Jost-SemiBold',
  },
});
