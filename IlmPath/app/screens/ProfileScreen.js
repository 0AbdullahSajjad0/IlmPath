import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { width, height, responsiveMargin, responsiveFontSize, responsiveIconSize, globalStyles, BookmarkIcon, EditProfIcon, TermsAndConditionsIcon, HelpCenterIcon, InviteFriendsIcon, LogoutIcon, UnlockedIcon } from '../styles/globalStyles';
import { useUser } from '../../context/UserContext';
import { getUserDetails } from '../services/profileService';

export default function ProfileScreen({ navigation }) {
    const { user, setUser  } = useUser();
    const [userName, setUserName] = useState('Guest');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (user && user.id && user.role) {
                const userDetails = await getUserDetails(user.id, user.role);
                if (userDetails) {
                    const firstName = userDetails.name.split(' ')[0];
                    setEmail(userDetails.email);
                    setUserName(firstName || 'Guest');
                }
            }
        };
        fetchUserDetails();
    }, [user]);

    const handleLogout = async () => {
        try {
            // ✅ Clear user data from AsyncStorage (if using persistent login)
            // await AsyncStorage.removeItem('userToken'); // If authentication is token-based
            // await AsyncStorage.removeItem('user');

            // ✅ Reset user context
            setUser({ id: null, role: null });

            // ✅ Navigate to Login Options Screen and reset navigation stack
            navigation.reset({
                index: 0,
                routes: [{ name: 'Options' }],
            });

            console.log("✅ Successfully logged out.");
        } catch (error) {
            console.error("⚠️ Logout failed:", error);
        }
    };

    if (!user || !user.id || !user.role) {
        return (
            <View style={[globalStyles.container, { backgroundColor: '#F0DEAE', justifyContent: 'center', alignItems: 'center' }]}>
                <View style={styles.emptyContainer}>
                    <Image
                        source={require('../assets/images/IlmPath_Splash.png')}
                        style={styles.emptyImage}
                    />
                    <Text style={styles.emptyText}>
                        Sign In To Avail Services
                    </Text>
                </View>
                <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate('SignIn')}>
                    <Text style={styles.signInText}>Sign In</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[globalStyles.container, { backgroundColor: '#F0DEAE' }]}>
            {/* Heading */}
            <View style={globalStyles.headerContainer}>
                <View style={globalStyles.backButtonContainer}>
                    <Text style={[globalStyles.subtitle, globalStyles.backText]}>Profile</Text>
                </View>
            </View>

            {/* Profile Section */}
            <View style={[globalStyles.formContainer, styles.profileContainer]}>
                {/* Profile Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../assets/images/Set_Picture.png')}
                        style={styles.profileImage}
                    />
                </View>

                {/* User Info */}
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.userEmail}>{email}</Text>

                {/* Options List */}
                {profileOptions.map((option, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.optionItem}
                        onPress={() => {
                            if (option.action === 'logout') {
                                handleLogout(); // ✅ Calls logout function
                            } else if (option.screen) {
                                navigation.navigate(option.screen);
                            }
                        }}
                    >
                        <View style={styles.iconLeft}>{option.iconLeft}</View>
                        <Text style={styles.optionText}>{option.title}</Text>
                        <View style={styles.iconRight}>{option.iconRight}</View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

// Profile Options Data
const profileOptions = [
    { title: 'Edit Profile', iconLeft: <EditProfIcon />, iconRight: <UnlockedIcon /> },
    { title: 'Bookmarks', iconLeft: <BookmarkIcon />, iconRight: <UnlockedIcon />, screen: 'BookmarkedSurahs' }, // ✅ Navigates to Bookmarked Ayahs Screen
    { title: 'Terms and Conditions', iconLeft: <TermsAndConditionsIcon />, iconRight: <UnlockedIcon /> },
    { title: 'Help Center', iconLeft: <HelpCenterIcon />, iconRight: <UnlockedIcon /> },
    { title: 'Invite Friends', iconLeft: <InviteFriendsIcon />, iconRight: <UnlockedIcon /> },
    { title: 'Logout', iconLeft: <LogoutIcon />, iconRight: <UnlockedIcon />, action: 'logout' },
];

// Styles
const styles = StyleSheet.create({
    profileContainer: {
        backgroundColor: 'white',
        width: width / 1.15,
        flexGrow: 1,
        borderRadius: responsiveIconSize(20),
        margin: responsiveMargin(20),
        marginTop: responsiveMargin(70),
        marginBottom: responsiveMargin(70),
        marginHorizontal: responsiveMargin(-50),
        padding: responsiveMargin(40),
        paddingBottom: responsiveMargin(-100),
        alignItems: 'center',
        elevation: 5,
    },
    imageContainer: {
        position: 'absolute',
        top: -50,
        width: responsiveIconSize(120),
        height: responsiveIconSize(120),
        borderRadius: responsiveIconSize(60),
        borderWidth: 3,
        borderColor: '#E0B15E',
        backgroundColor: '#fff',
        overflow: 'hidden',
        justifyContent: 'flex-end',
        alignItems: 'center',
        alignSelf: 'center',
        elevation: 10,
    },
    profileImage: {
        width: responsiveIconSize(100),
        height: responsiveIconSize(100),
        resizeMode: 'contain',
    },
    userName: {
        fontSize: responsiveFontSize(20),
        fontWeight: 'bold',
        marginTop: responsiveMargin(20),
        marginBottom: responsiveMargin(10),
        color: '#333',
    },
    userEmail: {
        fontSize: responsiveFontSize(12),
        color: '#666',
        marginBottom: responsiveMargin(30),
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: responsiveMargin(14),
        paddingRight: responsiveMargin(-10),
        width: '100%',
    },
    iconLeft: {
        marginRight: responsiveMargin(10),
    },
    iconRight: {
        marginLeft: 'auto',
    },
    optionText: {
        fontSize: responsiveIconSize(16),
        marginLeft: responsiveMargin(5),
        color: '#333',
        flex: 1,
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyImage: {
        width: width / 2,
        height: height / 4,
        resizeMode: 'contain',
    },
    emptyText: {
        fontSize: responsiveFontSize(16),
        fontFamily: 'Jost-SemiBold',
        marginTop: responsiveMargin(-20),
        color: '#4E240D',
    },
    signInButton: {
        backgroundColor: '#BC6C25',
        padding: responsiveMargin(15),
        marginTop: responsiveMargin(40),
        borderRadius: responsiveIconSize(10),
        alignItems: 'center',
        justifyContent: 'center',
        width: width / 3.5,
    },
    signInText: {
        color: 'white',
        fontSize: responsiveFontSize(16),
    },
});
