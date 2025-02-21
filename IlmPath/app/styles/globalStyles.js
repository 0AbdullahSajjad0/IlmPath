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


export const StarIcon = () => (
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

export const BackIcon = () => (
  <View style={{ marginTop: responsiveMargin(4) }}>
    <Svg width="27" height="20" viewBox="0 0 27 20" fill="none">
      <Path
        d="M26.207 9.99978C26.207 10.7581 25.586 11.3791 24.8277 11.3791H4.69001L10.9305 17.6548C11.4829 18.2072 11.4829 19.0693 10.9305 19.62C10.6895 19.8628 10.3446 20 9.96461 20C9.61978 20 9.24149 19.8628 9.00045 19.5865L0.413026 10.9657C-0.137675 10.4132 -0.137675 9.55115 0.413026 9.0339L9.00045 0.413026C9.55115 -0.137675 10.4132 -0.137675 10.9657 0.413026C11.5164 0.965452 11.5164 1.82754 10.9657 2.37824L4.69001 8.62044H24.8277C25.586 8.62044 26.207 9.24149 26.207 9.99978Z"
        fill="#4E240D" // Change color based on focus
        style={[globalStyles.icon, globalStyles.backIcon]}
      />
    </Svg>
  </View>
);

export const UnlockedIcon = () => (
  <View style={{ marginTop: responsiveMargin(4) }}>
    <Svg width="12" height="18" viewBox="0 0 12 18" fill="none">
      <Path
        d="M11.5872 8.98886C11.5872 9.33613 11.4402 9.65767 11.1997 9.90204L3.18327 17.6191C2.66219 18.1078 1.82046 18.0949 1.31275 17.5933C0.791681 17.1046 0.77832 16.2943 1.28603 15.7927L8.32718 8.92455L1.28603 2.18502C0.77832 1.68342 0.791681 0.873129 1.31275 0.384384C1.82046 -0.117222 2.64883 -0.130084 3.18327 0.358661L11.1997 8.07568C11.32 8.2043 11.4135 8.34577 11.4803 8.50012C11.5471 8.65446 11.5872 8.82166 11.5872 8.98886Z"
        fill="#4E240D" // Change color based on focus
        style={[globalStyles.icon, globalStyles.backIcon]}
      />
    </Svg>
  </View>
);

export const EditProfIcon = () => (
  <View style={{ marginTop: responsiveMargin(4) }}>
    <Svg width="16" height="20" viewBox="0 0 16 20" fill="none">
      <Path
        d="M7.99225 1.53133C6.98025 1.52733 6.01225 1.93033 5.29725 2.64833C4.58225 3.36733 4.18025 4.34433 4.18025 5.35933C4.17625 6.91033 5.10225 8.31233 6.52725 8.91033C7.94925 9.50433 9.59025 9.18033 10.6833 8.08233C11.7733 6.98833 12.1013 5.33633 11.5123 3.90233C10.9223 2.46933 9.53125 1.53133 7.99225 1.53133ZM5.96525 0.40633C7.95325 -0.42167 10.2463 0.0393305 11.7652 1.57433C13.2892 3.10533 13.7422 5.41433 12.9142 7.41433C12.0903 9.41833 10.1442 10.7233 7.99225 10.7193C5.05525 10.7113 2.67625 8.31633 2.67625 5.35933L2.68425 5.12933C2.77025 3.05233 4.04725 1.20733 5.96525 0.40633ZM5.88325 12.7663C7.32025 12.6453 8.76625 12.6453 10.2032 12.7663C10.9882 12.8213 11.7692 12.9343 12.5352 13.1103C14.1952 13.4463 15.2812 14.1063 15.7343 15.0743C16.0972 15.8753 16.0863 16.8013 15.7072 17.5983C15.2462 18.5673 14.1602 19.2273 12.4722 19.5713C11.7113 19.7423 10.9332 19.8523 10.1482 19.9033C9.28525 20.0003 8.55125 20.0003 7.86725 20.0003H7.59825C7.21125 19.9573 6.91825 19.6293 6.91825 19.2393C6.91825 18.8483 7.21125 18.5203 7.59825 18.4773H8.19525C8.79325 18.4693 9.39825 18.4423 10.0002 18.3913C10.7113 18.3443 11.4183 18.2423 12.1173 18.0903C13.3123 17.8283 14.0663 17.4493 14.3013 16.9463C14.4843 16.5633 14.4843 16.1173 14.3013 15.7353C14.0663 15.2233 13.3123 14.8283 12.1403 14.5903C11.4333 14.4303 10.7153 14.3243 9.99225 14.2813C8.64125 14.1563 7.28125 14.1563 5.93025 14.2813C5.21525 14.3283 4.50425 14.4263 3.80525 14.5783C2.60525 14.8443 1.86325 15.2233 1.62125 15.7233C1.53125 15.9143 1.48825 16.1213 1.48825 16.3323C1.48825 16.5433 1.53125 16.7543 1.62125 16.9463C2.03525 17.5203 2.66825 17.8913 3.36725 17.9773L3.46925 18.0043C3.69925 18.0823 3.87925 18.2703 3.94925 18.5123C4.03125 18.7813 3.95325 19.0783 3.75025 19.2783C3.54725 19.4773 3.25025 19.5433 2.98425 19.4533C1.85525 19.2703 0.86725 18.5943 0.28125 17.6063C-0.09375 16.8093 -0.09375 15.8793 0.28125 15.0823C0.74625 14.0863 1.82825 13.4463 3.50025 13.1023C4.28525 12.9303 5.08225 12.8213 5.88325 12.7663Z"
        fill="#4E240D" // Change color based on focus
        style={[globalStyles.icon, globalStyles.backIcon]}
      />
    </Svg>
  </View>
);

export const TermsAndConditionsIcon = () => (
  <View style={{ marginTop: responsiveMargin(4) }}>
    <Svg width="16" height="18" viewBox="0 0 16 18" fill="none">
      <Path
        d="M9.16551 7.9452C9.16022 8.30085 8.97407 8.6328 8.65986 8.82872V10.5296C8.65986 10.8753 8.36545 11.1536 7.99975 11.1536C7.63405 11.1536 7.33965 10.8753 7.33965 10.5296V8.82872C7.02543 8.6328 6.83928 8.30085 6.834 7.9452C6.834 7.33621 7.35549 6.84328 7.99975 6.84328C8.64402 6.84328 9.16551 7.33621 9.16551 7.9452ZM14.4728 10.3C14.0648 12.9469 10.9135 15.2817 9.07705 16.4423C8.42222 16.8566 7.57729 16.8566 6.92246 16.4423C5.08604 15.2817 1.93468 12.9469 1.53333 10.3736L1.32078 4.22764C1.31154 3.94811 1.49637 3.69977 1.78021 3.61242C3.81731 3.05085 5.78179 2.29087 7.64858 1.33995C7.86509 1.20892 8.13442 1.20892 8.35093 1.33995C10.2177 2.29087 12.1875 3.05085 14.2246 3.61242C14.5031 3.69977 14.6893 3.94811 14.6787 4.22764L14.4728 10.3ZM14.6167 2.4219C12.6826 1.89153 10.8158 1.17024 9.03613 0.277974C8.40242 -0.0926581 7.59709 -0.0926581 6.96339 0.277974C5.18373 1.17024 3.31695 1.89153 1.38283 2.4219C0.53789 2.67648 -0.024522 3.43147 0.000562107 4.27007L0.217078 10.481C0.708198 13.6058 4.16849 16.2089 6.19502 17.4806C7.28816 18.1731 8.71135 18.1731 9.80449 17.4806C11.8323 16.2089 15.2926 13.6058 15.7877 10.4123L15.9989 4.27007C16.024 3.43147 15.4629 2.67648 14.6167 2.4219Z"
        fill="#4E240D" // Change color based on focus
        style={[globalStyles.icon, globalStyles.backIcon]}
      />
    </Svg>
  </View>
);

export const HelpCenterIcon = () => (
  <View style={[{ marginTop: responsiveMargin(4), marginHorizontal: responsiveMargin(-2.5) }]}>
    <Svg width="23" height="23" viewBox="0 0 23 23" fill="none">
      <Path
        d="M9.21852 22.7707C8.81962 22.6924 8.56446 22.305 8.6428 21.9089C8.72115 21.51 9.10855 21.2549 9.50387 21.3332C14.6508 22.338 19.7072 19.2222 21.1253 14.1737C22.5406 9.12236 19.8395 3.83308 14.9175 2.0168C9.99908 0.202676 4.50999 2.46889 2.3063 7.22774C0.0990224 11.9866 1.92105 17.641 6.48655 20.2184C6.83155 20.4182 6.95015 20.8588 6.75321 21.2038C6.55412 21.5496 6.1128 21.6674 5.7678 21.4705C0.573398 18.4805 -1.45707 12.0038 1.10455 6.58446C3.66762 1.16868 9.95955 -1.37498 15.5665 0.744613C21.1728 2.86133 24.2138 8.93261 22.5513 14.6905C20.8896 20.4491 15.0835 23.9638 9.2099 22.7707H9.21852Z"
        fill="#4E240D" // Change color based on focus
      />
      <Path
        d="M11.5176 4.31348C7.54792 4.31348 4.33008 7.53132 4.33008 11.501C4.33008 15.4706 7.54792 18.6885 11.5176 18.6885C15.4872 18.6885 18.7051 15.4706 18.7051 11.501C18.7051 7.53132 15.4872 4.31348 11.5176 4.31348ZM11.5176 20.126C6.75298 20.126 2.89258 16.2656 2.89258 11.501C2.89258 6.73638 6.75298 2.87598 11.5176 2.87598C16.2822 2.87598 20.1426 6.73638 20.1426 11.501C20.1426 16.2656 16.2822 20.126 11.5176 20.126Z"
        fill="#4E240D" // Change color based on focus
      />
      <Path
        d="M11.5175 17.251C11.1215 17.251 10.7988 16.9283 10.7988 16.5323C10.7988 16.1363 11.1215 15.8135 11.5175 15.8135C11.9136 15.8135 12.2363 16.1363 12.2363 16.5323C12.2363 16.9283 11.9136 17.251 11.5175 17.251ZM11.5175 14.376C11.1215 14.376 10.7988 14.0533 10.7988 13.6573C10.7988 12.6438 11.4083 11.7282 12.3427 11.3357C13.4208 10.9088 13.9685 9.70416 13.5811 8.61166C13.1937 7.517 12.0113 6.92763 10.9052 7.27263C9.79901 7.62122 9.16507 8.78057 9.46767 9.89822C9.56901 10.2828 9.33614 10.6759 8.95161 10.7737C8.56707 10.875 8.17392 10.6421 8.07545 10.2576C7.59532 8.39891 8.66195 6.49207 10.4955 5.92785C12.329 5.36075 14.2833 6.33466 14.9345 8.14016C15.5857 9.94566 14.7045 11.9445 12.9328 12.6805C12.5224 12.8322 12.2449 13.2196 12.2363 13.6573C12.2363 14.0533 11.9136 14.376 11.5175 14.376Z"
        fill="#4E240D" // Change color based on focus
      />
    </Svg>
  </View>
);

export const InviteFriendsIcon = () => (
  <View style={{ marginTop: responsiveMargin(4) }}>
    <Svg width="20" height="18" viewBox="0 0 20 18" fill="none">
      <Path
        d="M4.293 5.387C4.48 5.367 4.668 5.422 4.812 5.543L8.969 8.859C9.488 9.269 10.219 9.269 10.738 8.859L14.852 5.543H14.859L14.949 5.484C15.246 5.309 15.633 5.371 15.859 5.648C15.981 5.797 16.031 5.988 16.012 6.176C15.988 6.367 15.895 6.539 15.746 6.656L11.633 9.98C10.586 10.828 9.094 10.828 8.051 9.98L3.926 6.656L3.852 6.582C3.617 6.324 3.602 5.93 3.82 5.648C3.938 5.5 4.109 5.406 4.293 5.387ZM14.195 0C17.398 0.012 19.992 2.621 20 5.844V7.309L19.992 7.402C19.945 7.75 19.652 8.02 19.293 8.02L19.285 8.004L19.172 7.992C19.027 7.969 18.891 7.898 18.781 7.793C18.652 7.66 18.574 7.477 18.574 7.289V5.844C18.551 3.418 16.606 1.457 14.195 1.434H5.805C3.395 1.457 1.449 3.418 1.426 5.844V12.156C1.449 14.582 3.395 16.543 5.805 16.566H14.195C16.606 16.543 18.551 14.582 18.574 12.156C18.617 11.789 18.922 11.512 19.289 11.512C19.652 11.512 19.961 11.789 20 12.156C19.992 15.379 17.398 17.988 14.195 18H5.805C2.602 17.996 0.004 15.379 0 12.156V5.844C0 2.617 2.598 0 5.805 0H14.195Z"
        fill="#4E240D" // Change color based on focus
        style={[globalStyles.icon, globalStyles.backIcon]}
      />
    </Svg>
  </View>
);

export const LogoutIcon = () => (
  <View style={{ marginTop: responsiveMargin(4) }}>
    <Svg width="20" height="19" viewBox="0 0 20 19" fill="none">
      <Path
        d="M15.3092 0.792341C14.8464 0.491091 14.2269 0.622126 13.9257 1.08502C13.6244 1.54791 13.7554 2.16736 14.2183 2.46861L15.3092 0.792341ZM18.4437 11.628L19.4024 11.9125L19.4024 11.9125L18.4437 11.628ZM1.36864 11.628L0.40995 11.9125L0.409952 11.9125L1.36864 11.628ZM5.59404 2.46861C6.05693 2.16736 6.18796 1.54791 5.88671 1.08502C5.58546 0.622126 4.96601 0.491091 4.50312 0.792341L5.59404 2.46861ZM10.9054 1C10.9054 0.447715 10.4577 0 9.90537 0C9.35309 0 8.90537 0.447715 8.90537 1H10.9054ZM8.90537 8.69121C8.90537 9.24349 9.35309 9.69121 9.90537 9.69121C10.4577 9.69121 10.9054 9.24349 10.9054 8.69121H8.90537ZM14.2183 2.46861C17.1516 4.37762 18.4806 7.98834 17.485 11.3436L19.4024 11.9125C20.6498 7.70849 18.9847 3.18434 15.3092 0.792341L14.2183 2.46861ZM17.485 11.3436C16.4895 14.6986 13.4059 17 9.90618 17V19C14.2913 19 18.155 16.1165 19.4024 11.9125L17.485 11.3436ZM9.90618 17C6.40642 17 3.32287 14.6986 2.32732 11.3436L0.409952 11.9125C1.6574 16.1165 5.52104 19 9.90618 19V17ZM2.32732 11.3436C1.33175 7.98834 2.66072 4.37762 5.59404 2.46861L4.50312 0.792341C0.827657 3.18434 -0.837475 7.70849 0.40995 11.9125L2.32732 11.3436ZM8.90537 1V8.69121H10.9054V1H8.90537Z"
        fill="#4E240D" // Change color based on focus
        style={[globalStyles.icon, globalStyles.backIcon]}
      />
    </Svg>
  </View>
);

export const SearchIcon = () => (
  <View>
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Path
        d="M15.8043 14.8849L13.0538 12.1976L12.9914 12.1008C12.8698 11.9784 12.7074 11.9128 12.5354 11.9128C12.3666 11.9128 12.201 11.9784 12.0826 12.1008C9.74495 14.2441 6.14488 14.3601 3.66643 12.3721C1.18798 10.3816 0.603971 6.90635 2.3008 4.2479C3.99764 1.59025 7.4481 0.575827 10.3634 1.87585C13.2794 3.17588 14.757 6.38714 13.8138 9.38159C13.7482 9.6008 13.801 9.8352 13.9602 10.0008C14.117 10.1664 14.3546 10.2352 14.5794 10.1848C14.8042 10.1352 14.9858 9.96881 15.0546 9.7536C16.1795 6.20073 14.4794 2.37586 11.0546 0.752631C7.62891 -0.8682 3.50403 0.20062 1.35119 3.26868C-0.802455 6.33754 -0.340046 10.4816 2.44161 13.0257C5.21926 15.5665 9.48254 15.7409 12.4698 13.4353L14.9042 15.8161C15.1546 16.0633 15.5603 16.0633 15.8139 15.8161C16.0635 15.5689 16.0635 15.1689 15.8139 14.9193L15.8043 14.8849Z"
        fill="#4E240D" // Change color based on focus
        style={[globalStyles.icon, globalStyles.backIcon]}
      />
    </Svg>
  </View>
);

export const AttachIcon = () => (
  <View>
    <Svg width="13" height="19" viewBox="0 0 13 19" fill="none">
      <Path
        d="M9.90591 15.5803L12.483 8.49978C12.6015 8.17408 12.4334 7.81353 12.1077 7.69498C11.782 7.57644 11.4215 7.74456 11.3029 8.07026L8.72583 15.1507C8.05421 16.996 6.01057 17.949 4.16532 17.2773C2.32007 16.6057 1.3671 14.5621 2.03872 12.7168L5.33165 3.66956C5.76561 2.47728 7.0903 1.85957 8.28257 2.29352C9.47485 2.72747 10.0926 4.05217 9.65861 5.24444L6.58043 13.7017C6.383 14.2441 5.78154 14.5246 5.2391 14.3271C4.69666 14.1297 4.4162 13.5283 4.61363 12.9858L7.40547 5.3153C7.52402 4.9896 7.35589 4.62905 7.03019 4.51051C6.70449 4.39196 6.34394 4.56009 6.22539 4.88579L3.43355 12.5563C2.9996 13.7486 3.61731 15.0733 4.80959 15.5072C6.00186 15.9412 7.32656 15.3235 7.76051 14.1312L10.8387 5.67395C11.5103 3.8287 10.5573 1.78506 8.71209 1.11344C6.86684 0.441824 4.82319 1.39479 4.15157 3.24004L0.858637 12.2873C-0.049069 14.7812 1.2419 17.5497 3.7358 18.4574C6.2297 19.3651 8.9982 18.0742 9.90591 15.5803Z"
        fill="#202244" // Change color based on focus
        style={[globalStyles.icon, globalStyles.backIcon]}
      />
    </Svg>
  </View>
);

export const MicIcon = () => (
  <View>
    <Svg width="18" height="21" viewBox="0 0 18 21" fill="none">
      <Path
        d="M0.988274 7.944C0.953274 7.944 0.918274 7.947 0.883274 7.951C0.371274 8.01 -0.0117256 8.447 0.000274357 8.959V11.959C0.000274357 15.815 3.85127 19.004 7.70627 19.004H5.70627H5.60827C5.06527 19.043 4.65127 19.508 4.67927 20.051C4.70627 20.598 5.15927 21.02 5.70627 21.004H11.7063C12.0703 21.016 12.4093 20.824 12.5933 20.512C12.7773 20.199 12.7773 19.813 12.5933 19.5C12.4093 19.188 12.0703 18.996 11.7063 19.004H9.70627C13.5623 19.004 17.7063 15.856 17.7063 12V9C17.7063 8.449 17.2573 8 16.7023 8C16.1523 8 15.7023 8.449 15.7023 9V12C15.7023 14.774 12.4803 17.004 9.70627 17.004H7.70627C4.93327 17.004 2.14527 15.105 2.00027 11.959V8.959C2.00427 8.69 1.89827 8.432 1.70727 8.237C1.51627 8.045 1.25827 7.94 0.988274 7.944ZM8.71027 2.004C10.3783 2.004 11.7063 3.336 11.7063 5.008V10.004C11.7063 11.672 10.3783 13 8.71027 13C7.04227 13 5.70627 11.672 5.70627 10.004V5.008C5.70627 3.336 7.04227 2.004 8.71027 2.004ZM8.71027 0C5.96027 0 3.70627 2.258 3.70627 5.008V10.004C3.70627 12.754 5.96027 15 8.71027 15C11.4603 15 13.7063 12.754 13.7063 10.004V5.008C13.7063 2.258 11.4603 0 8.71027 0Z"
        fill="#F0DEAE" // Change color based on focus
        style={[globalStyles.icon, globalStyles.backIcon]}
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
