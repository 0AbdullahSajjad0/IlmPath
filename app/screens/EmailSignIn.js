import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { globalStyles, height } from '../styles/globalStyles';
import { apiPost } from '../helpers/api'; // Reusable API function

function EmailSignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignInPress = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both email and password.');
      return;
    }

    try {
      const data = await apiPost('/signin', { email, password });
      console.log('Sign In Successful:', data);
      navigation.replace('HomeTabs'); // Redirect to home page
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={globalStyles.container}>
      {/* Logo */}
      <View style={globalStyles.logoContainer}>
        <Image
          source={require('../assets/images/QuranLogo.png')}
          style={globalStyles.logoImage}
        />
        <Text style={globalStyles.logoText}>IlmPath</Text>
        <Text style={{ fontSize: 12 }}>Learn The Holy Quran</Text>
      </View>

      {/* Sign In Text */}
      <View style={globalStyles.loginTextContainer}>
        <Text style={globalStyles.text}>Let's Sign In!</Text>
        <Text style={{ fontSize: 12 }}>Login to continue learning</Text>
      </View>

      {/* Email Input */}
      <View style={globalStyles.inputWrapper}>
        <TextInput
          style={globalStyles.textInput}
          placeholder="Email"
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
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Sign In Button */}
      <TouchableOpacity style={globalStyles.button} onPress={handleSignInPress}>
        <Text style={globalStyles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Sign Up Redirect */}
      <View style={styles.signUp}>
        <Text>Don't have an Account? </Text>
        <TouchableOpacity onPress={handleSignUpPress}>
          <Text style={styles.signUpText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  signUp: {
    position: 'absolute',
    bottom: height * 0.03,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    textDecorationLine: 'underline',
    color: '#BC6C25',
  },
});

export default EmailSignIn;
