import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { globalStyles, width, height, responsiveFontSize, responsiveIconSize } from '../styles/globalStyles';

function EmailSignIn({ navigation }) { 

    const handleGuestPress = () => {
    // Handle button press action
    console.log('Guest Button Pressed');
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

    const [toggleCheckBox, setToggleCheckBox] = useState(false);

    return (
        <View style={globalStyles.container}>

            {/* Logo and Text */}
            <View style={globalStyles.logoContainer}>
                <Image
                    source={require('../assets/QuranLogo.png')} 
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
                        source={require('../assets/email_icon.png')}
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
                />
                
            </View>
            <View style={globalStyles.inputWrapper}>
                <View style={globalStyles.leftIconWrapper}>
                    <View style={globalStyles.iconContainer}>
                        <Image
                        source={require('../assets/lock_icon.png')}
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
                    secureTextEntry={true}
                />
                <View style={globalStyles.rightIconWrapper}>
                    <View style={globalStyles.iconContainer}>
                        <Image
                        source={require('../assets/hide_pass.png')}
                        style={globalStyles.icon}
                        />
                    </View>
                </View>
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
                        source={require('../assets/tick_icon.png')}
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
            <TouchableOpacity style={globalStyles.button} onPress={handleGuestPress}>
                <Text style={globalStyles.buttonText}>Sign In</Text>
                <View style={globalStyles.buttonIconContainer}>
                    <Image
                    source={require('../assets/right_arrow.png')}
                    style={globalStyles.icon}
                    />
                </View> 
            </TouchableOpacity> 

            {/* Continue with Email */}
            <Text style={{marginVertical: 25}}>Or Continue with</Text>
            <View>
                <View style={globalStyles.googleIconContainer}>
                        <Image
                        source={require('../assets/icons8-google-48.png')}
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