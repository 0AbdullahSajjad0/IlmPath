import React, { useState} from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet  } from 'react-native';
import { globalStyles, responsiveIconSize, responsiveFontSize, responsiveNegativeMargin, responsiveMargin } from '../styles/globalStyles';
import RNPickerSelect from 'react-native-picker-select';
import DropDownPicker from 'react-native-dropdown-picker';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

function SignUpScreen({ navigation }) {
        const handleSignUpPress = () => {

            // Email validation
            if (!email.trim()) { // Check if email is empty or just spaces
                console.log('Email field is empty');
                alert('Email field cannot be empty.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Matches any valid email
            if (!emailRegex.test(email)) {
                console.log('Invalid email format');
                alert('Please enter a valid Gmail address.');
                return;
            }

            // Password validation
            if (!password.trim()) { // Check if password is empty or just spaces
                console.log('Password field is empty');
                alert('Password field cannot be empty.');
                return;
            }

            if (password.length < 8) {
                console.log('Password is too short');
                alert('Password must be at least 8 characters long.');
                return;
            }

            if(toggleCheckBox == false){
                console.log('Please agree to terms & conditions.');
                alert('Please agree to terms & conditions before signing up.');
            }
            // Handle button press action
            else if(value == 'student'){
                console.log('Student Role Selected');
                console.log('Sign Up Button Pressed');
                navigation.navigate('StudentSignUp', { email: email, password: password });
                console.log('Navigated to StudentSignUp');
            }
            else if(value == 'ullama'){
                console.log('Ullama Role Selected');
                console.log('Sign Up Button Pressed');
                navigation.navigate('UllamaSignUp', { email: email, password: password });
                console.log('Navigated to UllamaSignUp');
            }
            else {
                console.log('Please select a role.');
                alert('Please select a role before signing up.');
            }
        };
    
        const handleGooglePress = () => {
        // Handle button press action
        console.log('Google Button Pressed');
        }; 
    
        const handleSignInPress = () => {
        // Handle button press action
        
        console.log('Sign In Button Pressed');
        navigation.navigate('SignIn');
        console.log('Navigated to EmailSignIn');
        };
    
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');  
        const [secureText, setSecureText] = useState(true); 
        const [toggleCheckBox, setToggleCheckBox] = useState(false);
        
        // State for DropDownPicker
        const [open, setOpen] = useState(false); // Controls dropdown visibility
        const [value, setValue] = useState(null); // Holds the selected value
        const [items, setItems] = useState([
            { label: 'Student', value: 'student' },
            { label: 'Ullama', value: 'ullama' },
        ]);

        return (
            
            <View style={globalStyles.container}>

                
                <ScrollView
                        contentContainerStyle={globalStyles.formContainer}
                        showsVerticalScrollIndicator={false}
                    >
                {/* Logo and Text */}
                <View style={[globalStyles.logoContainer, styles.logoContainer]}>
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
                <View style={[globalStyles.loginTextContainer, styles.loginTextContainer]}>
                    <Text style={globalStyles.text}>Getting Started.!</Text>
                    <Text style={{fontSize: 12}}>Create an Account to Unlock More Features</Text>
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

                {/* Role */}
                <View style={globalStyles.inputWrapper}>
                    {/* Left Icon */}
                    <View style={globalStyles.leftIconWrapper}>
                        <View style={globalStyles.iconContainer}>
                            <Image
                                source={require('../assets/images/person.png')}
                                style={globalStyles.icon}
                            />
                        </View>
                    </View>

                    {/* DropDownPicker */}
                    <View style={{ flex: 1, zIndex: 1000 }}>
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        placeholder="Select Role"
                        style={{
                            backgroundColor: 'white',
                            borderWidth: 0, 
                            justifyContent: 'center', // Center placeholder/selected text
                            height: responsiveIconSize(39), // Match parent view height
                            marginLeft: responsiveNegativeMargin(-10), // Adjust margin
                            marginTop: responsiveNegativeMargin(-10), // Adjust margin
                        }}
                        textStyle={{
                            fontSize: responsiveFontSize(13), // Match placeholder text size
                            color: '#545454', // Placeholder text color
                        }}
                        dropDownContainerStyle={{
                            backgroundColor: 'white',
                            elevation: 3, // Shadow for dropdown
                            marginTop: responsiveNegativeMargin(-5), // Adjust margin
                        }}
                        listMode="SCROLLVIEW"
                        arrowIconStyle={{
                            marginRight: responsiveNegativeMargin(-8), // Move the arrow icon slightly to the right
                        }}
                        onChangeValue={(selectedValue) => {
                            console.log('Selected Role:', selectedValue);
                        }}
                    />
                    </View>
                </View>


    
                {/* Agree to terms */}
                <View style={styles.checkboxRow}>
                    <View style={globalStyles.checkboxLabelContainer}>
                        <TouchableOpacity
                            style={[
                                styles.checkboxButton,
                                toggleCheckBox && styles.checkboxButtonPressed, // Apply green border when pressed
                            ]}
                            onPress={() => setToggleCheckBox(!toggleCheckBox)}
                        >
                            {toggleCheckBox && (
                                <Image
                                    source={require('../assets/images/tick_icon.png')}
                                    style={[
                                        globalStyles.checkboxTick,
                                        toggleCheckBox && styles.checkboxTickPressed, // Apply green tick when pressed
                                    ]}
                                />
                            )}
                        </TouchableOpacity>
                        <Text style={globalStyles.checkboxLabel}>Agree to Terms & Conditions</Text>
                    </View>
                </View>


    
                {/* Sign Up Button */}
                <TouchableOpacity style={globalStyles.button} onPress={handleSignUpPress}>
                    <Text style={globalStyles.buttonText}>Sign Up</Text>
                    <View style={globalStyles.buttonIconContainer}>
                        <Image
                        source={require('../assets/images/right_arrow.png')}
                        style={globalStyles.icon}
                        />
                    </View> 
                </TouchableOpacity> 
    
                {/* Continue with Google */}
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
                <View style={[globalStyles.signUp, styles.signUp]}>
                <Text style={{color: '#545454'}}>Already have an Account? </Text>
                    <TouchableOpacity onPress={handleSignInPress}><Text style={globalStyles.signUpText}>SIGN IN</Text></TouchableOpacity>
                </View>
                </ScrollView>
            </View>
        );
}

const styles = StyleSheet.create({
    logoContainer:{marginTop: 150} ,
    loginTextContainer:{marginLeft: '2%', alignSelf: 'flex-start'},
    signUp:{marginBottom: 50},
    pickerContainer: {
        flex: 1, // Allow RNPickerSelect to take up the remaining space
        justifyContent: 'center',
        zIndex: 1, // Ensure the picker is above the input
    },
    pickerInput: {
        width: '100%', // Ensure the picker input spans the container width
        color: '#000', // Text color for selected value
        paddingVertical: 10, // Adjust padding for consistent spacing
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        justifyContent: 'flex-start', 
        width: '100%', 
        marginBottom: 10,
    },
    checkboxButton: {
        width: responsiveIconSize(18),
        height: responsiveIconSize(18),
        borderWidth: 3, // Thicker border
        borderColor: '#000', // Default black border
        borderRadius: 9, // Makes it a circle
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10, 
        backgroundColor: 'white',
    },
    checkboxButtonPressed: {
        borderColor: '#0f0', // Green border when pressed
    },
    checkboxTickPressed: {
        tintColor: '#0f0', // Green color when pressed
    },
});

export default SignUpScreen;