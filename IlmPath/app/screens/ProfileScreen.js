import React, {useState} from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { width, height, responsiveMargin, responsiveFontSize, responsiveIconSize, globalStyles, BookmarkIcon, EditProfIcon, TermsAndConditionsIcon, HelpCenterIcon, InviteFriendsIcon, LogoutIcon, UnlockedIcon} from '../styles/globalStyles';
import { useUser } from '../../context/UserContext';
import { getProgress } from '../services/progressService';
import { getUserDetails } from '../services/profileService';

export default function ProfileScreen() {

    const { user } = useUser();
    const [userName, setUserName] = useState('Guest');
    const [email, setEmail] = useState('');

    const fetchUserDetails = async () => {
          if (user && user.id && user.role) {
            const userDetails = await getUserDetails(user.id, user.role);
            if (userDetails) {
              const firstName = userDetails.name.split(' ')[0];
              setEmail(userDetails.email);
              setUserName(firstName || 'Guest');
              setProfileImage(userDetails.profileImage || null);
            }
          }
        };
    
    fetchUserDetails();
    
    if (!user || !user.id || !user.role) {
      alert("Please log in to continue.");
      return;
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
            <TouchableOpacity key={index} style={styles.optionItem}>
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
    { title: 'Edit Profile', iconLeft: <EditProfIcon/>, iconRight: <UnlockedIcon/>},
    { title: 'Bookmarks', iconLeft: <BookmarkIcon/>, iconRight: <UnlockedIcon/>},
    { title: 'Terms and Conditions', iconLeft: <TermsAndConditionsIcon/>, iconRight: <UnlockedIcon/>},
    { title: 'Help Center', iconLeft: <HelpCenterIcon/>, iconRight: <UnlockedIcon/>},
    { title: 'Invite Friends', iconLeft: <InviteFriendsIcon/>, iconRight: <UnlockedIcon/>},
    { title: 'Logout', iconLeft: <LogoutIcon/>, iconRight: <UnlockedIcon/>},
  ];
  
  // Styles
  const styles = StyleSheet.create({
    profileContainer: {
      backgroundColor: 'white',
      width: width/1.15,
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
      borderWidth: 3, // Border around the circle
      borderColor: '#E0B15E', // Border color
      backgroundColor: '#fff',
      overflow: 'hidden',
      justifyContent: 'flex-end',
      alignItems: 'center',
      alignSelf: 'center',
      elevation: 10,
    },
    profileImage: {
        width: responsiveIconSize(100), // Diameter of the circle
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
  });
  