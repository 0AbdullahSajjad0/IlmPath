import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

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
});