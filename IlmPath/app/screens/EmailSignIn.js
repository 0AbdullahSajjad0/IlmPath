import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { globalStyles, width, height, responsiveFontSize, responsiveIconSize } from '../styles/globalStyles';
import * as SecureStore from "expo-secure-store";
import { useUser } from '../../context/UserContext';
import { signInUser } from '../services/authService';

function EmailSignIn({ navigation }) { 

    const handleSignInPress = async () => {

        if (!email.trim() || !password.trim()) {
            alert('Validation Error. Please fill all the fields.');
            return;
        }

        try {
            // Use the service function
            const result = await signInUser(email, password);
            
            if (!result.success && result.message !== "Sign In Successful") {
                // If sign-in fails, show the appropriate message
                alert(result.message);
                return;
            }

            console.log('Sign in successful:', result);
            
            // Save user details securely
            await SecureStore.setItemAsync('userId', result.user.id.toString());
            await SecureStore.setItemAsync('role', result.user.role);
      
            setUser({ id: result.user.id, role: result.user.role }); // Set user context
            navigation.replace('HomeTabs'); // Navigate to HomeTabs
        } catch (error) {
        alert(error.message);
        }

    };

    const handleGooglePress = () => {
    // Handle button press action
    console.log('Google Button Pressed');
    }; 

    const handleSignUpPress = () => {
    // Handle button press action
    console.log('Sign Up Button Pressed');
    navigation.navigate('SignUp');
    console.log('Navigated to EmailSignUp'); 
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');  
    const { setUser } = useUser(); // Access the setter from context
    const [secureText, setSecureText] = useState(true); 
    const [toggleCheckBox, setToggleCheckBox] = useState(false);

    return (
        <View style={globalStyles.container}>

            {/* Logo and Text */}
            <View style={globalStyles.logoContainer}>
                <Image
                    source={require('../assets/images/QuranLogo.png')} 
                    style={globalStyles.logoImage}    
                />
                <View style={{alignContent:'center', justifyContent:'center'}}>
                    <Text style={globalStyles.logoText}>IlmPath</Text>
                    <Text style={{fontFamily: 'verdana', fontSize: 12}}>Learn The Holy Quran</Text>
                </View>
            </View>

            {/* Login Text */}
            <View style={globalStyles.loginTextContainer}>
                <Text style={globalStyles.text}>Let's Sign In.!</Text>
                <Text style={{fontSize: 12}}>Login to Your Account to Continue Learning</Text>
            </View>

            {/* Email and Password Input */}
            <View style={globalStyles.inputWrapper}>
                <View style={globalStyles.leftIconWrapper}>
                    <View style={globalStyles.iconContainer}>
                        <Image
                        source={require('../assets/images/email_icon.png')}
                        style={globalStyles.icon}
                        />
                    </View>
                </View>
                <TextInput
                    style={globalStyles.textInput}
                    placeholder="Email"
                    placeholderTextColor="#A9A9A9"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(text) => setEmail(text)} // Update state on change
                />
                
            </View>
            <View style={globalStyles.inputWrapper}>
                <View style={globalStyles.leftIconWrapper}>
                    <View style={globalStyles.iconContainer}>
                        <Image
                        source={require('../assets/images/lock_icon.png')}
                        style={globalStyles.icon}
                        />
                    </View>
                </View>
                <TextInput
                    style={globalStyles.textInput}
                    placeholder="Password"
                    placeholderTextColor="#A9A9A9"
                    keyboardType="default"
                    autoCapitalize="none"
                    secureTextEntry={secureText}
                    value={password} 
                    onChangeText={(text) => setPassword(text)} // Update state on change
                />
                <TouchableOpacity
                        style={globalStyles.rightIconWrapper}
                        onPress={() => setSecureText(!secureText)} // Toggle secureText state
                >
                    <View style={globalStyles.iconContainer}>
                        <Image
                            source={require('../assets/images/hide_pass.png')}
                            style={globalStyles.icon}
                        />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Remember Me and Forgot Password */}
            <View style={styles.checkboxRow}>
                <View style={globalStyles.checkboxLabelContainer}>
                    <TouchableOpacity
                    style={styles.checkboxButton}
                    onPress={() => setToggleCheckBox(!toggleCheckBox)}
                    >
                    {toggleCheckBox && (
                        <Image
                        source={require('../assets/images/tick_icon.png')}
                        style={globalStyles.checkboxTick}
                        />
                    )}
                    </TouchableOpacity>
                    <Text style={globalStyles.checkboxLabel}>Remember Me</Text>
                </View>

                <TouchableOpacity onPress={() => console.log('Forgot Password Pressed')}>
                    <Text style={globalStyles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity style={globalStyles.button} onPress={handleSignInPress}>
                <Text style={globalStyles.buttonText}>Sign In</Text>
                <View style={globalStyles.buttonIconContainer}>
                    <Image
                    source={require('../assets/images/right_arrow.png')}
                    style={globalStyles.icon}
                    />
                </View> 
            </TouchableOpacity> 

            {/* Continue with Email */}
            <Text style={{marginVertical: 25}}>Or Continue with</Text>
            <View>
                <View style={globalStyles.googleIconContainer}>
                        <Image
                        source={require('../assets/images/icons8-google-48.png')}
                        style={globalStyles.icon}
                        />
                </View>
            </View>

            {/* Sign Up Text */}
            <View style={styles.signUp}>
            <Text style={{color: '#545454'}}>Don't have an Account? </Text>
                <TouchableOpacity onPress={handleSignUpPress}><Text style={styles.signUpText}>SIGN UP</Text></TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', 
        width: '100%', 
        paddingHorizontal: 20, 
        marginBottom: 10,
    },
    checkboxButton: {
        width: responsiveIconSize(18),
        height: responsiveIconSize(18),
        borderWidth: 2,
        borderColor: '#4E240D',
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10, 
        backgroundColor: 'white',
    },
    
    signUp:{
        position: 'absolute',
        bottom: height * 0.03,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    signUpText: {
        textDecorationLine: 'underline',
        color: '#BC6C25',
    },
});


export default EmailSignIn;