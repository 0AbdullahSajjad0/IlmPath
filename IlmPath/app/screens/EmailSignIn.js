import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { globalStyles, width, height, responsiveFontSize, responsiveIconSize } from '../styles/globalStyles';

function EmailSignIn({ navigation }) { 

    const handleSignInPress = async () => {

        if (!email.trim() || !password.trim()) {
            alert('Validation Error. Please fill all the fields.');
            return;
        }

        const signInData = {
            email, 
            password, 
        };

        console.log('Sign Up Data:', signInData);

        try {
            // API call
            console.log("Sending sign up request 1");
            const response = await fetch("http://192.168.100.75:5000/signin", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(signInData),
            });
            console.log("Sending sign up request 2");
            // Handle response
            const result = await response.json();
            if (response.ok) {
              console.log("Sign in successful:", result);
              alert("Success", "Sign in Successful");
              navigation.replace("HomeTabs", { user: result.user }); // Navigate to HomeTabs
            } else {
              console.error("Sign in failed:", result);
              alert("Error", result.message || "Sign In Failed");
            }
          } catch (error) {
            console.error("Error during sign in:", error);
            alert("Error", "An unexpected error occurred. Please try again.");
          }

        // Handle button press action
        //console.log('Sign In Button Pressed');
        //navigation.replace('HomeTabs');
        //console.log('Navigated to HomeScreen'); 
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