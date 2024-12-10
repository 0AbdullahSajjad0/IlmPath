import React, { useState} from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet, Platform  } from 'react-native';
import { globalStyles, responsiveIconSize, responsiveFontSize, responsiveNegativeMargin, responsiveMargin, InsertPicIcon } from '../styles/globalStyles';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker
import DropDownPicker from 'react-native-dropdown-picker';
import IntlPhoneInput from 'react-native-international-phone-number';
import * as ImagePicker from 'expo-image-picker';

function UllamaSignUp({ navigation, route }) {

    const { email, password } = route.params;
    console.log('Email:', email);
    console.log('Password:', password);
    
    const handleSignUpPress = () => {
        // Handle button press action
    console.log("Date: " + dob);
    console.log("selectedCountry: " + selectedCountry.callingCode);
    console.log("inputValue: " + inputValue);
    console.log("selectedImage: " + selectedImage);
    console.log('HomeTabs Button Pressed');
    navigation.replace('HomeTabs');
    console.log('Navigated to HomeTabs');
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

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [inputValue, setInputValue] = useState('');

    function handleInputValue(phoneNumber) {
        setInputValue(phoneNumber);
      }
    
      function handleSelectedCountry(country) {
        console.log('Selected Country:', country);
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

    const [selectedImage, setSelectedImage] = useState(null);

    const pickImage = async () => {
        // Ask for gallery permission
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission Required', 'Permission to access gallery is required.');
            return;
        }

        // Open image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri); // Save the selected image URI
            Alert.alert('Image Uploaded', 'The image has been uploaded successfully!');
        }
    };
    
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


                {/* Name and Expertise Input */}
                <View style={[globalStyles.inputWrapper, {padding:20}]}>
                    
                    <TextInput
                        style={globalStyles.textInput}
                        placeholder="Full Name"
                        placeholderTextColor="#A9A9A9"
                        keyboardType="default"
                        autoCapitalize="none"
                    />
                    
                </View>
                <View style={[globalStyles.inputWrapper, {padding:20}]}>
                    <TextInput
                        style={globalStyles.textInput}
                        placeholder="Expertise"
                        placeholderTextColor="#A9A9A9"
                        keyboardType="default"
                        autoCapitalize="none"
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
                        defaultCountry="US" // Set default country
                        defaultValue="+12505550199"
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
                              marginLeft: responsiveNegativeMargin(-15),
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

                {/* Upload Image */}
                <View style={[globalStyles.inputWrapper,{paddingBottom: 0, paddingHorizontal:responsiveMargin(11) }]}>
                    {/* Date of Birth Input */}
                    <View style={[globalStyles.inputWrapper, {flex: 1,flexDirection:'row', paddingBottom: 0} ]}>
                        <View style={[styles.leftIconWrapper, {marginRight: responsiveMargin(10)}]}>
                            <InsertPicIcon/>
                        </View>
                        <TouchableOpacity onPress={pickImage}>
                            <Text style={styles.dateText}>
                                {selectedImage ? 'Image Selected' : 'Upload an Image'}
                            </Text>
                        </TouchableOpacity>
                        {selectedImage && (
                            <Image
                                source={{ uri: selectedImage }}
                                style={styles.previewImage} // Display selected image (optional)
                            />
                        )}
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

export default UllamaSignUp;