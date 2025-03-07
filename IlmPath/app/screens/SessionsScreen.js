import React, { useCallback, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { width, height, responsiveMargin, responsiveFontSize, ProfileBox, globalStyles } from '../styles/globalStyles';
import { fetchStudentAppointments, fetchUllamaAppointments, checkAndEndAppointment } from '../services/appointmentService';
import { useUser } from '../../context/UserContext';

export default function SessionsScreen({ navigation }) {
  const [data, setData] = useState([]); // Replace with your data
  const { user } = useUser();

  useFocusEffect(
    useCallback(() => {
      const getAppointments = async () => {
        console.log('Fetching appointments for:', user.id, 'Role:', user.role);
    
        let appointments = [];
    
        if (user.role === 'ullama') {
          appointments = await fetchUllamaAppointments(user.id);
        } else if (user.role === 'student') {
          appointments = await fetchStudentAppointments(user.id);
        }
    
        console.log('Appointments:', appointments);
        setData(appointments);
      };
    
      getAppointments();
    }, [user.id, user.role])
  );
  

  const handleNewSession = () => {
    console.log('New Session Pressed');
    navigation.navigate('UllamaList');
    console.log('Navigated to Ullama List');
  };

  const handleEditSessions = () => {
    console.log('Edit Sessions Pressed');
    navigation.navigate('EditSessions'); // Adjust based on actual edit screen name
    console.log('Navigated to Edit Sessions');
  };

  const handleSessionPress = async (appointment) => {
    const result = await checkAndEndAppointment(appointment.id);
  
    if (result.expired) {
      alert(result.message);
  
      // Refresh the list
      if (user.role === 'ullama') {
        setData(await fetchUllamaAppointments(user.id));
      } else {
        setData(await fetchStudentAppointments(user.id));
      }
  
      return;
    }

    if (result.notStarted) {
      alert(result.message);
      return;
    }
  
    navigation.navigate('OpenSession', { appointment });
  };

  return (
    <View style={[globalStyles.container, { backgroundColor: '#F0DEAE' }]}>
      {/* Back Button */}
      <View style={globalStyles.headerContainer}>
        <View style={globalStyles.backButtonContainer}>
          <Text style={[globalStyles.subtitle, globalStyles.backText]}>Sessions</Text>
          <TouchableOpacity style={styles.rowButton} onPress={user.role === 'ullama' ? handleEditSessions : handleNewSession}>
            <Text style={styles.rowButtonText}>{user.role === 'ullama' ? 'Edit Sessions' : 'New Session'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          globalStyles.formContainer
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* {data.length > 0 ? (
          // Display list when data exists
          data.map((item, index) => (
            <TouchableOpacity key={index} style={styles.listItem}>
              <Text style={styles.listItemText}>{item}</Text>
            </TouchableOpacity>
          ))
        ) */}
        {/* Ulama Profile Boxes */}
        {data.length > 0 ? (
          data.map((item, index) => (
            <ProfileBox
              key={index}
              name={user.role === 'ullama' ? item.student_name : item.ulama_name}
              expertise={user.role === 'ullama' ? item.appointment_details : item.expertise}
              picture={
                (user.role === 'ullama'
                  ? item.student_profile_image
                  : item.profileImage) || require('../assets/images/Set_Picture.png')
              }
              onPress={() => handleSessionPress(item)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Image
              source={require('../assets/images/IlmPath_Splash.png')}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>
              {user.role === 'ullama'
                ? 'No student appointments yet.'
                : 'Book a session to avail services'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rowButton: {
    backgroundColor: '#BC6C25',
    borderRadius: 8,
    paddingVertical: responsiveMargin(8),
    paddingHorizontal: responsiveMargin(14),
    marginStart: responsiveMargin(160),
  },
  rowButtonText: {
    fontSize: responsiveFontSize(12),
    fontFamily: 'Jost-SemiBold',
    color: 'white',
  },
  listItem: {
    backgroundColor: '#EAC98F',
    padding: responsiveMargin(12),
    marginVertical: responsiveMargin(8),
    borderRadius: 8,
  },
  listItemText: {
    fontSize: responsiveFontSize(14),
    fontFamily: 'Jost-SemiBold',
    color: '#4E240D',
  },
  emptyContainer: {
    flex: 1,
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
});
