import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { globalStyles, responsiveIconSize, responsiveFontSize, responsiveNegativeMargin } from '../styles/globalStyles';

function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [open, setOpen] = useState(false);
  const [items] = useState([
    { label: 'Student', value: 'student' },
    { label: 'Ullama', value: 'ullama' },
  ]);

  const handleSignUpPress = () => {
    if (!email || !password || !role) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    // Navigate to the next screen with the collected data
    navigation.navigate('StudentSignUp', { email, password, role });
  };

  const handleSignInPress = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={globalStyles.container}>
      <ScrollView contentContainerStyle={globalStyles.formContainer} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={[globalStyles.logoContainer, styles.logoContainer]}>
          <Image source={require('../assets/images/QuranLogo.png')} style={globalStyles.logoImage} />
          <View style={{ alignContent: 'center', justifyContent: 'center' }}>
            <Text style={globalStyles.logoText}>IlmPath</Text>
            <Text style={{ fontFamily: 'verdana', fontSize: 12 }}>Learn The Holy Quran</Text>
          </View>
        </View>

        {/* Sign Up Heading */}
        <View style={[globalStyles.loginTextContainer, styles.loginTextContainer]}>
          <Text style={globalStyles.text}>Getting Started.!</Text>
          <Text style={{ fontSize: 12 }}>Create an Account to Unlock More Features</Text>
        </View>

        {/* Email Input */}
        <View style={globalStyles.inputWrapper}>
          <TextInput
            style={globalStyles.textInput}
            placeholder="Email"
            placeholderTextColor="#A9A9A9"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password Input */}
        <View style={globalStyles.inputWrapper}>
          <TextInput
            style={globalStyles.textInput}
            placeholder="Password"
            placeholderTextColor="#A9A9A9"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Role Dropdown */}
        <View style={globalStyles.inputWrapper}>
          <DropDownPicker
            open={open}
            value={role}
            items={items}
            setOpen={setOpen}
            setValue={setRole}
            placeholder="Select Role"
            style={{
              backgroundColor: 'white',
              borderWidth: 0,
              justifyContent: 'center',
              height: responsiveIconSize(39),
              marginLeft: responsiveNegativeMargin(-10),
              marginTop: responsiveNegativeMargin(-10),
            }}
            textStyle={{
              fontSize: responsiveFontSize(13),
              color: '#545454',
            }}
            dropDownContainerStyle={{
              backgroundColor: 'white',
              elevation: 3,
              marginTop: responsiveNegativeMargin(-5),
            }}
            listMode="SCROLLVIEW"
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={globalStyles.button} onPress={handleSignUpPress}>
          <Text style={globalStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Already Have an Account */}
        <View style={[globalStyles.signUp, styles.signUp]}>
          <Text style={{ color: '#545454' }}>Already have an Account? </Text>
          <TouchableOpacity onPress={handleSignInPress}>
            <Text style={globalStyles.signUpText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: { marginTop: 150 },
  loginTextContainer: { marginLeft: '2%', alignSelf: 'flex-start' },
  signUp: { marginBottom: 50 },
});

export default SignUpScreen;
