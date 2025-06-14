import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import {
  responsiveMargin,
  responsiveFontSize,
  responsiveIconSize,
  SearchIcon,
  globalStyles,
} from '../styles/globalStyles';
import { searchChatbot } from '../services/chatbotService';

export default function ChatbotScreen({ navigation }) {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      Alert.alert("Error", "Please enter a question.");
      return;
    }

    Alert.alert("Processing", "Fetching relevant Ayahs...", []);

    console.log('Searching chatbot for:', query);
    const results = await searchChatbot(query);

    if (results.length === 0) {
      Alert.alert("No Results", "No relevant Ayahs found.");
      return;
    }

    const extractedReferences = results.map(({ surah_no, ayah_no }) => ({
      surah_no,
      ayah_no,
    }));

    console.log('Extracted Ayah References:', extractedReferences);

    navigation.navigate('ChatbotResult', { extractedReferences });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

          {/* Scrollable Content to prevent keyboard hiding */}
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Middle Section: Logo and Texts */}
            <View style={styles.middleSection}>
              <Image
                source={require('../assets/images/QuranLogo.png')}
                style={styles.logo}
              />
              <Text style={styles.middleText1}>Welcome to Our Quranic Chatbot</Text>
              <Text style={styles.middleText1}>Write a Query and get the Answers in the light </Text>
              <Text style={styles.middleText1}>of The Holy Quran</Text>
            </View>
          </ScrollView>

          {/* Bottom Section: Input Field with a Round Button */}
          <View style={styles.bottomSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                placeholderTextColor="#999"
                value={query}
                onChangeText={setQuery}
                returnKeyType="search"
                onSubmitEditing={handleSearch} // Allows pressing "Enter" to search
              />
              <TouchableOpacity style={styles.roundButton} onPress={handleSearch}>
                <SearchIcon />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topSection: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    paddingHorizontal: responsiveMargin(10),
    paddingTop: responsiveMargin(10),
  },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    borderRadius: responsiveIconSize(10),
    width: responsiveIconSize(40),
    height: responsiveIconSize(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: responsiveMargin(10),
  },
});
