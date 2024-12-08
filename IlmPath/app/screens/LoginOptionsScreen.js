import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

function LoginOptionsScreen({ navigation }) {

  const handleGuestPress = () => {
    console.log('HomeTabs Button Pressed');
    navigation.replace('HomeTabs');
    console.log('Navigated to HomeTabs');
    };

  const handleGooglePress = () => {
    // Handle button press action
    console.log('Google Button Pressed');
    }; 

  const handleEmailPress = () => {
    // Handle button press action
    console.log('Email Button Pressed');
    navigation.navigate('EmailSignIn');
    console.log('Navigated to EmailSignIn'); 
    };

  const handleSignUpPress = () => {
    // Handle button press action
    console.log('Sign Up Button Pressed');
    navigation.navigate('SignUp');
    console.log('Navigated to SignUp');
    };

  

  return (
    <View style={styles.container}>
        <Text style={styles.text}>Let's you in</Text>

        <View>
            <TouchableOpacity style={styles.optionContainer} onPress={handleGooglePress}>
                <View style={styles.iconContainer}>
                    <Image
                    source={require('../assets/images/icons8-google-48.png')}
                    style={styles.icon}
                    />
                </View>
                <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionContainer} onPress={handleEmailPress}>
                <View style={styles.iconContainer}>
                    <Image
                    source={require('../assets/images/email_icon.png')}
                    style={styles.icon}
                    />
                </View>
                <Text style={styles.googleText}>Continue with Email</Text>
            </TouchableOpacity>
        </View>

        <Text style={{marginTop: 50}}>(Or)</Text>
            
        
        <TouchableOpacity style={styles.button} onPress={handleGuestPress}>
            <Text style={styles.buttonText}>Continue As a Guest</Text>
            <View style={styles.iconContainer}>
                <Image
                source={require('../assets/images/right_arrow.png')}
                style={styles.icon}
                />
            </View> 
        </TouchableOpacity>
        <View style={styles.signUp}>
            <Text style={{color: '#545454'}}>Don't have an Account? </Text>
            <TouchableOpacity onPress={handleSignUpPress}><Text style={styles.signUpText}>SIGN UP</Text></TouchableOpacity>
        </View>
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold', 
    fontFamily: 'Jost-SemiBold',
    color: '#4E240D',
    marginBottom: 45,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20, // Makes it a circle
    backgroundColor: '#F0DEAE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    width: '50%',
    height: '50%',
    resizeMode: 'contain',
  },
  googleText: {
    fontSize: 16,
    color: '#545454',
    marginLeft: 15, 
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 30, // Makes the button curved
    backgroundColor: '#BC6C25', 
  },
  buttonText: {
    flex: 1, // Take up remaining space
    fontSize: 16,
    fontFamily: 'Jost-SemiBold',
    color: '#F0DEAE',
    textAlign: 'center', // Center text horizontally
    
    // Optionally add fontFamily if you're using custom fonts
  },
  signUp:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  signUpText: {
    textDecorationLine: 'underline',
    color: '#BC6C25',
  },
});

export default LoginOptionsScreen;
