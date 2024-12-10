import React, { useState} from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet, Platform  } from 'react-native';
import { globalStyles, responsiveIconSize, responsiveFontSize, responsiveNegativeMargin, responsiveMargin } from '../styles/globalStyles';
import { useUser } from '../../context/UserContext';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker
import DropDownPicker from 'react-native-dropdown-picker';
import IntlPhoneInput from 'react-native-international-phone-number';
import * as SecureStore from "expo-secure-store";
import config from '../../config';

function StudentSignUp({ navigation, route }) {

    const { email, password } = route.params;
    //console.log('Email:', email);
    //console.log('Password:', password);

    const handleSignUpPress = async () => {

        if (!fullName.trim() || !nickName.trim() || !dob || !inputValue.trim() || !value) {
            alert('Validation Error. Please fill all the fields.');
            return;
        }

        // Handle button press action
        // console.log('Email: ', email);
        // console.log('Password', password);
        // console.log('Full Name:', fullName);
        // console.log('Nick Name:', nickName);
        // console.log('Date of Birth:', dob);
        // console.log('Phone Number:', inputValue);
        // console.log('Gender:', value);

        const signUpData = {
            email, // Passed from route params
            password, // Passed from route params
            role: "student", // Example role, update based on selection
            name: fullName,
            nickName,
            dob,
            phoneNo: selectedCountry.callingCode + inputValue,
            gender: value,
        };

        console.log('Sign Up Data:', signUpData);

        try {
            // API call
            console.log("Sending sign up request 1");
            const response = await fetch(`${config.apiBaseUrl}/signup`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(signUpData),
            });
            console.log("Sending sign up request 2");
            // Handle response
            const result = await response.json();
            if (response.ok) {
              console.log("Sign up successful:", result);
              alert("Success", "Sign Up Successful");

              await SecureStore.setItemAsync("userId", result.user.id.toString());

              setUser({ id: result.user.id, role: result.user.role });

              navigation.replace("HomeTabs"); // Navigate to HomeTabs
            } else {
              console.error("Sign up failed:", result);
              alert("Error", result.message || "Sign Up Failed");
            }
          } catch (error) {
            console.error("Error during sign up:", error);
            alert("Error", "An unexpected error occurred. Please try again.");
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

    const { setUser } = useUser(); // Access the setter from context
    const [fullName, setFullName] = useState('');
    const [nickName, setNickName] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [inputValue, setInputValue] = useState('');

    function handleInputValue(phoneNumber) {
        setInputValue(phoneNumber);
      }
    
      function handleSelectedCountry(country) {
        setSelectedCountry(country);
      }

    const [dob, setDob] = useState(''); // State to store selected date
    const [showDatePicker, setShowDatePicker] = useState(false); // State to control the date picker visibility
    const [tempDate, setTempDate] = useState(new Date()); // Temporary date state to manage selection

    
    const handleDateChange = (event, selectedDate) => {
        if (Platform.OS === 'ios') {
            // On iOS, keep updating tempDate
            if (selectedDate) {
                setTempDate(selectedDate);
            }
        } else {
            // On Android, confirm the selection
            setShowDatePicker(false); // Close picker
            if (selectedDate) {
                const formattedDate = selectedDate.toISOString().split('T')[0]; // Format the date
                setDob(formattedDate); // Save the selected date
            }
        }
    };

    const handleConfirmDate = () => {
        // On iOS, confirm the selected date and close picker
        setDob(tempDate.toISOString().split('T')[0]);
        setShowDatePicker(false);
    };

   
        // State for DropDownPicker
    const [open, setOpen] = useState(false); // Controls dropdown visibility
    const [value, setValue] = useState(null); // Holds the selected value
    const [items, setItems] = useState([
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
    ]);

    
    return (
        <View style={globalStyles.container}>
                
                {/* Back Button */}
                <View style={globalStyles.headerContainer}>
                    <View style={globalStyles.backButtonContainer}>
                        <Image
                            source={require('../assets/images/Back_Icon.png')}
                            style={[globalStyles.icon, globalStyles.backIcon]}
                        />
                        <Text style={[globalStyles.subtitle, globalStyles.backText]}>Fill Your Profile</Text>
                    </View>
                </View>
                
                <ScrollView
                        contentContainerStyle={globalStyles.formContainer}
                        showsVerticalScrollIndicator={false}
                    >
    
                
                <View style={styles.profileContainer}>
                    {/* Large Circle for Profile Picture */}
                    <View style={styles.profilePicture}>
                        <Image
                            source={require('../assets/images/Set_Picture.png')} // Replace with your default profile picture path
                            style={styles.profileImage}
                        />
                    </View>

                    {/* Small Circle for Edit Icon */}
                    <TouchableOpacity style={styles.editCircle}>
                        <Image
                            source={require('../assets/images/Edit_Icon.png')} // Replace with your edit icon path
                            style={styles.editIcon}
                        />
                    </TouchableOpacity>
                </View>


                {/* Email and Password Input */}
                <View style={[globalStyles.inputWrapper, {padding:20}]}>
                    
                    <TextInput
                        style={globalStyles.textInput}
                        placeholder="Full Name"
                        placeholderTextColor="#A9A9A9"
                        keyboardType="default"
                        autoCapitalize="none"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                    
                </View>
                <View style={[globalStyles.inputWrapper, {padding:20}]}>
                    <TextInput
                        style={globalStyles.textInput}
                        placeholder="Nick Name"
                        placeholderTextColor="#A9A9A9"
                        keyboardType="default"
                        autoCapitalize="none"
                        value={nickName}
                        onChangeText={setNickName}
                    />
                </View>

                <View style={[globalStyles.inputWrapper,{paddingBottom: 0, paddingHorizontal:responsiveMargin(11) }]}>
                    {/* Date of Birth Input */}
                    <View style={[globalStyles.inputWrapper, {flex: 1,flexDirection:'row', paddingBottom: 0} ]}>
                        <View style={[styles.leftIconWrapper, {marginRight: responsiveMargin(10)}]}>
                            <Image
                                source={require('../assets/images/Dob_Icon.png')}
                                style={styles.icon}
                            />
                        </View>
                        <TouchableOpacity
                            style={[styles.textInput]}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.dateText}>
                                {dob ? dob : 'Date of Birth'} {/* Show selected date or placeholder */}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Show DateTimePicker */}
                    {showDatePicker && (
                        <View>
                            <DateTimePicker
                                value={tempDate} // Use temporary date state
                                mode="date" // Date picker mode
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                maximumDate={new Date()} // Limit to current or past dates
                                onChange={handleDateChange} // Handle date changes
                            />
                            {/* Done button for iOS */}
                            {Platform.OS === 'ios' && (
                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={handleConfirmDate}
                                >
                                    <Text style={styles.confirmText}>Done</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>

                {/* Phone Number Input */}
                <View style={styles.phoneInputContainer}>
                    <IntlPhoneInput
                        value={inputValue}
                        onChangePhoneNumber={handleInputValue}
                        selectedCountry={selectedCountry}
                        onChangeSelectedCountry={handleSelectedCountry}
                        defaultCountry="PK" // Set default country
                        defaultValue=""
                        phoneInputStyles={{
                            container: {
                              flex: 1,
                              backgroundColor: 'white',
                              borderWidth: 1,
                              borderStyle: 'solid',
                              height: responsiveIconSize(55),
                              borderRadius: 12,
                              borderColor: 'white',
                              alignItems:'center',
                              
                            },
                            flagContainer: {
                              backgroundColor: 'white',
                              justifyContent: 'center',
                              
                            },
                            flag: {},
                            caret: {
                              color: 'black',
                              fontSize: 16,
                            },
                            divider: {
                              backgroundColor: 'white',
                            },
                            callingCode: {
                              fontSize: responsiveFontSize(15),
                              color: 'black',
                              marginLeft: responsiveNegativeMargin(-20),
                            },
                            input: {
                              flex: 1,
                              color: 'black',
                              textAlign: 'left',
                            },
                          }}
                    />
                </View>

                {/* Gender DropDown */}
                <View style={[globalStyles.inputWrapper, {padding:14}]}>
                    

                    {/* DropDownPicker */}
                    <View style={{ flex: 1, zIndex: 1000 }}>
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        placeholder="Gender"
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
                            marginLeft: responsiveMargin(6), // Adjust margin
                            color: '#545454', // Placeholder text color
                        }}
                        dropDownContainerStyle={{
                            backgroundColor: 'white',
                            elevation: 3, // Shadow for dropdown
                            marginTop: responsiveNegativeMargin(-5), // Adjust margin
                            zIndex: 1000, // Correct stacking order
                        }}
                        listMode='SCROLLVIEW'
                        arrowIconStyle={{
                            marginRight: responsiveNegativeMargin(-15), // Move the arrow icon slightly to the right
                        }}
                        onChangeValue={(selectedValue) => {
                            console.log('Selected Role:', selectedValue);
                        }}
                    />
                    </View>
                </View>

    
                {/* Sign Up Button */}
                <TouchableOpacity style={[globalStyles.button, {marginTop:50, marginBottom:50}]} onPress={handleSignUpPress}>
                    <Text style={globalStyles.buttonText}>Sign Up</Text>
                    <View style={globalStyles.buttonIconContainer}>
                        <Image
                        source={require('../assets/images/right_arrow.png')}
                        style={globalStyles.icon}
                        />
                    </View> 
                </TouchableOpacity> 
    
                
                </ScrollView>
            </View>
    );
}

const styles = StyleSheet.create({
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
        marginRight: responsiveMargin(10), 
        backgroundColor: 'white',
    },
    checkboxButtonPressed: {
        borderColor: '#0f0', // Green border when pressed
    },
    checkboxTickPressed: {
        tintColor: '#0f0', // Green color when pressed
    },
    profileContainer: {
        alignItems: 'center', // Center the profile picture horizontally
        marginTop: responsiveMargin(40), // Add margin above the profile container
        marginBottom: responsiveMargin(40), // Add margin below the profile container
        position: 'relative', // Allow absolute positioning for the edit circle
    },
    profilePicture: {
        width: responsiveIconSize(100), // Diameter of the circle
        height: responsiveIconSize(100),    
        borderRadius: responsiveIconSize(50), // Makes it a circle
        backgroundColor: '#E8F1FF', // Placeholder background color
        justifyContent: 'flex-end',
        alignItems: 'center',
        overflow: 'hidden', // Ensures the image fits within the circle
    },
    profileImage: {
        width: responsiveIconSize(80), // Adjust size slightly smaller than the container
        height: responsiveIconSize(80),
        resizeMode: 'contain', // Ensures the image covers the circle
    },
    editCircle: {
        position: 'absolute', // Positions it relative to the profile picture
        bottom: responsiveNegativeMargin(0), // Adjusts position slightly outside the bottom-right corner
        right: responsiveNegativeMargin(0),
        width: responsiveIconSize(30), // Diameter of the edit circle
        height: responsiveIconSize(30),
        borderRadius: responsiveIconSize(15), // Makes it a circle
        backgroundColor: '#BC6C25', // White background for the edit circle
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Adds shadow for better visibility
    },
    editIcon: {
        width: responsiveIconSize(16), // Adjust size of the edit icon
        height: responsiveIconSize(16),
        marginLeft: responsiveMargin(2),
        resizeMode: 'contain', // Ensures the icon fits well
    },
    phoneNumberWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: responsiveMargin(10),
        paddingHorizontal: responsiveMargin(18),
        borderRadius: 10,
        borderColor: 'white', // Light gray border
    },
    phoneInputContainer: {
        flex: 1,
        borderRadius: 8,
        margin: responsiveMargin(20),
        marginTop: 0,
    },
    intlPhoneInput: {
        fontSize: responsiveFontSize(14),
        color: '#000',
    }
});

export default StudentSignUp;