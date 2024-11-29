import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import {
  globalStyles,
  responsiveIconSize,
  responsiveMargin,
} from '../styles/globalStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import IntlPhoneInput from 'react-native-international-phone-number';

function StudentSignUp({ navigation, route }) {
  const { email, password, role } = route.params;

  const [name, setName] = useState('');
  const [nickName, setNickName] = useState('');
  const [dob, setDob] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState({});
  const [gender, setGender] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle phone number changes
  const handlePhoneNumberChange = (data) => {
    if (!data || typeof data !== 'object') {
      console.error('Invalid data received from IntlPhoneInput:', data);
      return;
    }

    const { phoneNumber, isValid, dialCode } = data;

    if (typeof phoneNumber === 'string' && phoneNumber.trim() !== '') {
      console.log(`PhoneNumber: ${phoneNumber}, IsValid: ${isValid}, DialCode: ${dialCode}`);
      setPhoneNumber(phoneNumber);
    } else {
      console.warn('PhoneNumber is missing or invalid:', data);
    }
  };

  // Handle country selection changes
  const handleSelectedCountryChange = (country) => {
    if (!country || typeof country !== 'object') {
      console.error('Invalid country data received from IntlPhoneInput:', country);
      return;
    }

    console.log('Selected Country:', country);
    setSelectedCountry(country);
  };

  // Function to handle sign-up form submission
  const handleSignUpPress = async () => {
    if (!name || !dob || !phoneNumber || !gender) {
      Alert.alert('Error', 'Please fill in all the required fields.');
      return;
    }

    const userData = {
      email,
      password,
      role,
      name,
      nickName,
      dob,
      phoneNo: phoneNumber,
      gender,
      country: selectedCountry.name?.en || 'Unknown',
    };

    try {
      const response = await fetch('http://192.168.1.7:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Account created successfully!');
        navigation.replace('HomeTabs');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Sign-up failed.');
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  // Handle date picker changes
  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'ios') {
      if (selectedDate) setDob(selectedDate.toISOString().split('T')[0]);
    } else {
      setShowDatePicker(false);
      if (selectedDate) setDob(selectedDate.toISOString().split('T')[0]);
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={globalStyles.backButtonContainer}>
          <Image
            source={require('../assets/images/Back_Icon.png')}
            style={[globalStyles.icon, globalStyles.backIcon]}
          />
          <Text style={[globalStyles.subtitle, globalStyles.backText]}>Fill Your Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={globalStyles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.profileContainer}>
          <View style={styles.profilePicture}>
            <Image
              source={require('../assets/images/Set_Picture.png')}
              style={styles.profileImage}
            />
          </View>
          <TouchableOpacity style={styles.editCircle}>
            <Image
              source={require('../assets/images/Edit_Icon.png')}
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={[globalStyles.inputWrapper, { padding: 20 }]}>
          <TextInput
            style={globalStyles.textInput}
            placeholder="Full Name"
            placeholderTextColor="#A9A9A9"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={[globalStyles.inputWrapper, { padding: 20 }]}>
          <TextInput
            style={globalStyles.textInput}
            placeholder="Nick Name"
            placeholderTextColor="#A9A9A9"
            value={nickName}
            onChangeText={setNickName}
          />
        </View>

        <View style={[globalStyles.inputWrapper, { paddingHorizontal: responsiveMargin(11) }]}>
          <TouchableOpacity
            style={styles.textInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: dob ? '#000' : '#A9A9A9' }}>{dob || 'Date of Birth'}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={styles.phoneInputContainer}>
          <IntlPhoneInput
            defaultCountry="US"
            value={phoneNumber}
            onChangePhoneNumber={handlePhoneNumberChange}
            onChangeSelectedCountry={handleSelectedCountryChange}
            phoneInputStyles={{
              container: { backgroundColor: 'white', height: responsiveIconSize(55) },
              input: { color: 'black' },
            }}
          />
        </View>

        <View style={[globalStyles.inputWrapper, { padding: 14 }]}>
          <DropDownPicker
            open={dropdownOpen}
            value={gender}
            items={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
            ]}
            setOpen={setDropdownOpen}
            setValue={setGender}
            placeholder="Gender"
            style={globalStyles.textInput}
          />
        </View>

        <TouchableOpacity style={globalStyles.button} onPress={handleSignUpPress}>
          <Text style={globalStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    marginVertical: responsiveMargin(20),
    position: 'relative',
  },
  profilePicture: {
    width: responsiveIconSize(100),
    height: responsiveIconSize(100),
    borderRadius: responsiveIconSize(50),
    backgroundColor: '#E8F1FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: responsiveIconSize(80),
    height: responsiveIconSize(80),
    resizeMode: 'contain',
  },
  editCircle: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: responsiveIconSize(30),
    height: responsiveIconSize(30),
    borderRadius: responsiveIconSize(15),
    backgroundColor: '#BC6C25',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  phoneInputContainer: {
    flex: 1,
    borderRadius: 8,
    margin: responsiveMargin(20),
  },
});

export default StudentSignUp;
