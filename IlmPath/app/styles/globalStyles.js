import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Svg, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const scale = width / 375; 
const verticalScale = height / 812; 

// Scaling functions
const responsiveFontSize = (fontSize) => fontSize * scale;
const responsiveIconSize = (size) => size * scale;
const responsiveNegativeMargin = (value) => value * scale;
const responsiveMargin = (value) => value * scale; 

export {width, height, responsiveFontSize, responsiveIconSize, responsiveNegativeMargin, responsiveMargin};
export const globalStyles  = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F9FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    // Logo and Text
    logoContainer: {
        
        flexDirection: 'row', 
        alignItems: 'center',
        marginVertical: 60,
        
    },
    logoImage: {
        width: responsiveIconSize(80), 
        height: responsiveIconSize(80), 
        resizeMode: 'contain', 
        marginRight: 1, 
    },
    logoText: {
        fontSize: responsiveFontSize(23), 
        color: '#BC6C25', 
        fontFamily: 'Atma-Bold', 
    },

    // Login Text
    loginTextContainer: {
        width: '85%', 
        alignItems: 'flex-start', 
        marginBottom: 30,
    },

    text: {
        fontSize: responsiveFontSize(21),
        marginBottom: 10,
        fontFamily: 'Jost-SemiBold',
        color: '#4E240D',
    },

    // Email and Password Input
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderRadius: 12,
        backgroundColor: 'white',
        padding: 8,
        width: '90%', 
        marginBottom: 20,
    },
    leftIconWrapper: {
        width: responsiveIconSize(39),
        height: responsiveIconSize(39),
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightIconWrapper: {
        width: responsiveIconSize(39),
        height: responsiveIconSize(39),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    iconStyle: {
        width: responsiveIconSize(19),
        height: responsiveIconSize(19),
        resizeMode: 'contain',
    },
    textInput: {
        flex: 1, 
        fontSize: responsiveFontSize(13),
        color: '#000',
    },
    iconContainer: {
        width: responsiveIconSize(31),
        height: responsiveIconSize(31),
        borderRadius: 20, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: '50%',
        height: '50%',
        resizeMode: 'contain'
    },
    googleText: {
        fontSize: responsiveFontSize(15),
        color: '#545454',
        marginLeft: 15, 
    },
    // Remember Me and Forgot Password
    checkboxLabelContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
    },
    checkboxTick: {
        width: responsiveIconSize(11),
        height: responsiveIconSize(11),
        resizeMode: 'contain',
        tintColor: '#000', // Default black color
    },
    checkboxLabel: {
        fontSize: responsiveFontSize(11),
        color: '#545454',
    },
    forgotPassword: {
        fontSize: responsiveFontSize(11),
        color: '#545454', 
    },
    // Sign In Button
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '85%',
        marginTop: 30,
        paddingVertical: 15,
        borderRadius: 30, 
        backgroundColor: '#BC6C25', 
    },
    buttonText: {
        flex: 1, 
        fontSize: responsiveFontSize(18),
        fontFamily: 'Jost-SemiBold',
        color: '#F0DEAE',
        textAlign: 'center', 
        
    },
    buttonIconContainer: {
        position: 'absolute',
        right: '3%',    
        width: responsiveIconSize(43),
        height: responsiveIconSize(43),
        borderRadius: 22, 
        backgroundColor: '#F0DEAE',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    // Continue with Google
    googleIconContainer: {
        width: responsiveIconSize(39),
        height: responsiveIconSize(39),
        borderRadius: 20, 
        backgroundColor: '#F0DEAE',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    signUp:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    signUpText: {
        textDecorationLine: 'underline',
        color: '#BC6C25',
    },
    headerContainer: {
        width: '100%', // Ensures the container spans the width of the screen
        paddingHorizontal: responsiveIconSize(20), // Adds horizontal padding
        paddingVertical: responsiveIconSize(15), // Adds vertical padding
        marginTop: responsiveMargin(50), // Adds margin
        alignItems: 'flex-start', // Aligns content to the left
        justifyContent: 'flex-start', // Aligns content at the top
    
    },
    profileImage: {
      width: responsiveIconSize(40), // Adjust size slightly smaller than the container
      height: responsiveIconSize(40),
      resizeMode: 'contain', // Ensures the image covers the circle
    },
    backButtonContainer: {
        flexDirection: 'row', // Places icon and text side by side
        alignItems: 'center', // Aligns icon and text vertically
    },
    backIcon: {
        marginRight: responsiveMargin(15), // Adds space between the icon and text
        width: responsiveIconSize(24), // Adjust icon size
        height: responsiveIconSize(24),
    },
    backText: {
        fontSize: responsiveFontSize(20), // Adjust font size
        color: '#545454', // Text color
        fontFamily: 'Jost-SemiBold', // Ensure font consistency
    },
    rowContainer: {
      width: width/1.15, // Adjust width for two boxes side by side
      height: height/17,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#EAC98F',  
      borderRadius: 8,
      marginVertical: responsiveMargin(20),
      paddingHorizontal: responsiveMargin(20),
    },
});


const StarIcon = () => (
  <Svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <Path
      d="M31.0781 12.6219V5.97656C31.0781 5.39409 30.6059 4.92188 30.0234 4.92188H23.3781L18.7442 0.307336C18.3326 -0.102445 17.6673 -0.102445 17.2557 0.307336L12.6219 4.92188H5.97656C5.39409 4.92188 4.92188 5.39409 4.92188 5.97656V12.6219L0.307336 17.2558C-0.102445 17.6674 -0.102445 18.3327 0.307336 18.7443L4.92188 23.3781V30.0234C4.92188 30.6059 5.39409 31.0781 5.97656 31.0781H12.6219L17.2557 35.6927C17.4615 35.8976 17.7308 36 18 36C18.2692 36 18.5385 35.8976 18.7442 35.6927L23.3781 31.0781H30.0234C30.6059 31.0781 31.0781 30.6059 31.0781 30.0234V23.3781L35.6927 18.7443C36.1024 18.3327 36.1024 17.6674 35.6927 17.2558L31.0781 12.6219ZM29.2761 22.1983C29.0793 22.396 28.9688 22.6635 28.9688 22.9425V28.9688H22.9425C22.6636 28.9688 22.396 29.0793 22.1984 29.2761L18 33.4569L13.8017 29.2761C13.604 29.0793 13.3365 28.9688 13.0575 28.9688H7.03125V22.9425C7.03125 22.6636 6.92072 22.396 6.72391 22.1984L2.54313 18L6.72391 13.8017C6.92072 13.604 7.03125 13.3365 7.03125 13.0575V7.03125H13.0575C13.3364 7.03125 13.604 6.92072 13.8016 6.72391L18 2.54313L22.1984 6.72391C22.3961 6.92072 22.6636 7.03125 22.9425 7.03125H28.9688V13.0575C28.9688 13.3364 29.0793 13.604 29.2761 13.8016L33.4569 18L29.2761 22.1983Z"
      fill="#4E240D" // Adjust color as needed
      style={styles.iconStyle}
    />
  </Svg>
);

export const BookmarkIcon = ({ filled }) => (
  <Svg width="16" height="19" viewBox="0 0 16 19" fill="none">
    {filled ? (
      <Path
        d="M2.08996 18.06C1.82474 18.06 1.57039 17.9546 1.38285 17.7671C1.19531 17.5796 1.08996 17.3252 1.08996 17.06L0.939957 2.4C0.927916 2.10234 0.97484 1.80525 1.07803 1.52579C1.18122 1.24633 1.33865 0.990038 1.54124 0.77164C1.74384 0.553243 1.98762 0.377054 2.25856 0.253208C2.52949 0.129361 2.82224 0.0603016 3.11996 0.05L12.71 0C13.0081 0.00520682 13.3022 0.0690924 13.5757 0.188008C13.8491 0.306923 14.0964 0.478538 14.3035 0.69305C14.5106 0.907563 14.6734 1.16077 14.7826 1.43821C14.8918 1.71565 14.9453 2.01189 14.94 2.31L15.08 16.97C15.0817 17.1452 15.0373 17.3178 14.9513 17.4705C14.8653 17.6232 14.7407 17.7506 14.59 17.84C14.4379 17.9278 14.2655 17.974 14.09 17.974C13.9144 17.974 13.742 17.9278 13.59 17.84L7.88996 14.68L2.59996 17.91C2.44331 17.9975 2.26903 18.0488 2.08996 18.06Z"
        fill="#4E240D" // Filled version
      />
    ) : (
      <Path
        d="M2.08996 18.06C1.82474 18.06 1.57039 17.9546 1.38285 17.7671C1.19531 17.5796 1.08996 17.3252 1.08996 17.06L0.939957 2.4C0.927916 2.10234 0.97484 1.80525 1.07803 1.52579C1.18122 1.24633 1.33865 0.990038 1.54124 0.77164C1.74384 0.553243 1.98762 0.377054 2.25856 0.253208C2.52949 0.129361 2.82224 0.0603016 3.11996 0.05L12.71 0C13.0081 0.00520682 13.3022 0.0690924 13.5757 0.188008C13.8491 0.306923 14.0964 0.478538 14.3035 0.69305C14.5106 0.907563 14.6734 1.16077 14.7826 1.43821C14.8918 1.71565 14.9453 2.01189 14.94 2.31L15.08 16.97C15.0817 17.1452 15.0373 17.3178 14.9513 17.4705C14.8653 17.6232 14.7407 17.7506 14.59 17.84C14.4379 17.9278 14.2655 17.974 14.09 17.974C13.9144 17.974 13.742 17.9278 13.59 17.84L7.88996 14.68L2.59996 17.91C2.44331 17.9975 2.26903 18.0488 2.08996 18.06ZM7.84996 12.51C8.02372 12.5103 8.19498 12.5514 8.34996 12.63L13.06 15.24L12.94 2.29C12.94 2.09 12.81 1.95 12.73 1.96L3.12996 2.05C3.04996 2.05 2.93996 2.18 2.93996 2.38L3.05996 15.28L7.33996 12.65C7.4954 12.561 7.67086 12.5128 7.84996 12.51Z"
        fill="#4E240D" // Outlined version
      />
    )}
  </Svg>
);


export const PlayIcon = () => (
  <Svg width="15" height="18" viewBox="0 0 15 18" fill="none">
    <Path
      d="M13.7146 9.51302L1.94465 16.9054C1.85175 16.9636 1.74473 16.9962 1.63476 16.9997C1.52478 17.0032 1.41586 16.9775 1.31938 16.9253C1.22289 16.873 1.14235 16.7962 1.08618 16.7028C1.03 16.6094 1.00024 16.5028 1 16.3942V1.607C1.00002 1.49827 1.02963 1.39154 1.08571 1.29796C1.1418 1.20439 1.22231 1.1274 1.31884 1.07504C1.41536 1.02268 1.52436 0.996866 1.63445 1.0003C1.74453 1.00374 1.85166 1.0363 1.94465 1.09458L13.7158 8.48941C13.8029 8.54428 13.8746 8.61993 13.9243 8.70939C13.974 8.79884 14 8.8992 14 9.00121C14 9.10322 13.974 9.20359 13.9243 9.29304C13.8746 9.3825 13.8029 9.45815 13.7158 9.51302H13.7146Z"
      fill="#4E240D" // Adjust color as needed
      style={styles.iconStyle}
    />
  </Svg>
);

export const NoteIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <Path
      d="M-0.0012207 14.25V18H3.74878L14.8088 6.94L11.0588 3.19L-0.0012207 14.25ZM2.91878 16H1.99878V15.08L11.0588 6.02L11.9788 6.94L2.91878 16ZM17.7088 2.63L15.3688 0.29C15.1688 0.09 14.9188 0 14.6588 0C14.3988 0 14.1488 0.1 13.9588 0.29L12.1288 2.12L15.8788 5.87L17.7088 4.04C18.0988 3.65 18.0988 3.02 17.7088 2.63Z"
      fill="#4E240D" // Adjust color as needed
      style={styles.iconStyle}
    />
  </Svg>
);

export const InsertPicIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <Path
      d="M16 2V16H2V2H16ZM16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM11.14 8.86L8.14 12.73L6 10.14L3 14H15L11.14 8.86Z"
      fill="#4E240D" // Adjust color as needed
      style={styles.iconStyle}
    />
  </Svg>
);

export const SessionsIcon = ({ color }) => (
  <View style={{ marginTop: responsiveMargin(4) }}>
    <Svg width="25" height="25" viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.0007,0 C12.6497,0 15.1997,1.05 17.0697,2.93 C18.9497,4.811 20.0007,7.35 20.0007,10.01 C20.0007,13.51 18.1597,16.76 15.1597,18.57 C12.1597,20.38 8.4297,20.48 5.3307,18.83 L5.3307,18.83 L5.2997,18.83 C5.0007,18.71 4.7597,18.5 4.4797,18.36 C4.1707,18.23 3.8197,18.21 3.5007,18.311 C2.7597,18.57 2.0097,18.78 1.2397,18.96 C0.8397,18.97 0.7197,18.73 0.7197,18.34 C0.8997,17.55 1.1397,16.769 1.4207,16.01 C1.5297,15.68 1.5007,15.33 1.3307,15.019 L1.3307,15.019 L1.1307,14.63 C0.3897,13.22 0.0007,11.65 0.0007,10.061 L0.0007,10.061 L0.0007,10 C0.0007,7.35 1.0497,4.8 2.9297,2.93 C4.8097,1.05 7.3497,0 10.0007,0 Z M14.6097,8.73 C13.9097,8.73 13.3307,9.3 13.3307,10.01 C13.3307,10.71 13.9097,11.29 14.6097,11.29 C15.3197,11.29 15.8897,10.71 15.8897,10.01 C15.8897,9.3 15.3197,8.73 14.6097,8.73 Z M10.0007,8.73 C9.2907,8.73 8.7197,9.3 8.7197,10.01 C8.7197,10.71 9.2907,11.29 10.0007,11.29 C10.7107,11.29 11.2797,10.71 11.2797,10.01 C11.2797,9.3 10.7107,8.73 10.0007,8.73 Z M5.3897,8.73 C4.6797,8.73 4.1097,9.3 4.1097,10.01 C4.1097,10.71 4.6797,11.29 5.3897,11.29 C6.0897,11.29 6.6707,10.71 6.6707,10.01 C6.6707,9.3 6.0897,8.73 5.3897,8.73 Z"
        fill={color} // Change color based on focus
      />
    </Svg>
  </View>
);


// Reusable Component
export const SurahBox = ({ id, arabicName, romanName, place, totalAyahs, onPress }) => (
  <TouchableOpacity style={{width:width}} onPress={() => onPress(id)}>
    <View style={styles.verticalLineAndBoxContainer}>
      {/* Vertical Line */}
      <View style={styles.verticalLine}></View>

      {/* Box */}
      <View style={styles.infoBox}>
        {/* Left Section (Icon and Numeric Text) */}
        <View style={styles.iconAndNumberContainer}>
            <StarIcon />
            <Text style={styles.numberInsideIcon}>{id}</Text>
        </View>

        {/* Middle Section (Three Texts) */}
        <View style={styles.textContainer}>
          <Text style={styles.topText}>{romanName}</Text>
          <Text style={styles.bottomText}>{`${place} . ${totalAyahs} Ayat`}</Text>
        </View>

        {/* Right Section (Arabic Text) */}
        <Text style={styles.arabicText}>{arabicName}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

  const styles = StyleSheet.create({
    verticalLineAndBoxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: responsiveMargin(10),
      marginHorizontal: responsiveMargin(20),
    },
    verticalLine: {
      width: responsiveIconSize(6), // Thickness of the vertical line
      borderRadius: 5, // Rounded corners
      height: height / 12.5, // Height of the vertical line
      backgroundColor: '#4E240D', // Color of the vertical line
      marginRight: responsiveMargin(10), // Spacing between the line and the box
    },
    infoBox: {
      flex: 1, // Take up remaining space
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#E8F1FF', // Box background color
      borderRadius: 12,
      padding: responsiveMargin(15),
      elevation: 3, // Shadow for Android
      shadowColor: '#000', // Shadow color for iOS
      shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
      shadowOpacity: 0.2, // Shadow opacity for iOS
      shadowRadius: 5, // Shadow radius for iOS
    },
    iconAndNumberContainer: {
      width: responsiveIconSize(36), // Adjust based on your icon size
      height: responsiveIconSize(36), 
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative', // Allow the text to overlay the icon
    },
    iconStyle: {
      width: '100%', // Fill the container
      height: '100%',
      resizeMode: 'contain', // Keep aspect ratio
    },
    numberInsideIcon: {
      position: 'absolute', // Position the number on top of the icon
      fontSize: responsiveFontSize(12),
      fontWeight: 'bold',
      color: '#4E240D', // Ensure contrast
    },
    numberText: {
      fontSize: responsiveFontSize(20),
      fontWeight: 'bold',
      color: '#4E240D',
    },
    textContainer: {
      flex: 1, // Take up remaining space in the middle
      paddingLeft: responsiveMargin(10),
    },
    topText: {
      fontSize: responsiveFontSize(14),
      fontWeight: '600',
      color: '#4E240D',
      marginBottom: responsiveMargin(5),
    },
    bottomText: {
      fontSize: responsiveFontSize(12),
      color: '#545454',
    },
    arabicText: {
      fontSize: responsiveFontSize(16),
      fontWeight: 'bold',
      color: '#4E240D',
    },
    profilePicture: {
      width: responsiveIconSize(50), // Diameter of the circle
      height: responsiveIconSize(50),    
      borderRadius: responsiveIconSize(50), // Makes it a circle
      backgroundColor: '#E8F1FF', // Placeholder background color
      justifyContent: 'flex-end',
      alignItems: 'center',
      alignSelf: 'center',
      overflow: 'hidden', // Ensures the image fits within the circle
    },
    horizontalLine: {
      width: width/1.15, // Adjust to ensure it's wide enough
      height: 1, // Thin line
      backgroundColor: 'white', // Use black for visibility; adjust if needed
      color: 'white',
      borderColor: 'white', // Use black for visibility; adjust if needed
      alignSelf: 'center', // Center the line horizontally
    },
    
  });

  export const ProfileBox = ({ name, expertise, picture, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <View style={[globalStyles.rowContainer, {paddingHorizontal:responsiveMargin(10), backgroundColor: '#F0DEAE'}]}>
        {/* Circular Image */}
        <View style={styles.profilePicture}>
          <Image source={picture} style={globalStyles.profileImage} />
        </View>
        {/* Name and Expertise */}
        <View style={styles.textContainer}>
          <Text style={{fontFamily:'Jost-SemiBold',fontSize:responsiveFontSize(15),marginBottom:responsiveMargin(5)}}>{name}</Text>
          <Text style={{fontSize:responsiveFontSize(10), opacity:0.5}}>{expertise}</Text>
        </View>
      </View>
  
      {/* Horizontal Line */}
      <View style={styles.horizontalLine} />
    </TouchableOpacity>
  );
