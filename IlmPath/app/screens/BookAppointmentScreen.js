import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { width, height, responsiveIconSize, responsiveMargin, responsiveFontSize, ProfileBox, globalStyles, NoteIcon } from '../styles/globalStyles';
import { LinearGradient } from 'expo-linear-gradient'; // Import from expo-linear-gradient
import {Svg, Path} from 'react-native-svg';
import {React, useState} from 'react'
import { useStripe } from '@stripe/stripe-react-native';
import { fetchPaymentIntentClientSecret } from '../services/ullamaService';

const getCurrentWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + 1); // Monday
    const weekDates = [];
  
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      if (date >= today) {
        // Add only future or today's dates
        weekDates.push({
          day: date.getDate(),
          label: date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase(),
        });
      }
    }
  
    return weekDates; // Limit to Mon-Fri
};

export default function BookAppointmentScreen({navigation}) {

    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(14); // Example selected date
    const [selectedTime, setSelectedTime] = useState(''); // Example selected time
    const currentWeekDates = getCurrentWeekDates();
  
    const times = [
      '09:00 AM',
      '09:30 AM',
      '10:00 AM',
      '10:30 AM',
      '12:00 PM',
      '12:30 PM',
      '01:00 PM',
      '02:00 PM',
      '03:00 PM',
      '04:30 PM',
      '05:00 PM',
    ];
  
    const openPaymentSheet = async () => {
      setLoading(true);
    
      const clientSecret = await fetchPaymentIntentClientSecret();
    
      if (!clientSecret) {
        alert('Unable to fetch client secret.');
        setLoading(false);
        return;
      }
    
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
      });
    
      if (initError) {
        console.error('Error initializing PaymentSheet:', initError.message);
        alert('Failed to initialize payment sheet.');
        setLoading(false);
        return;
      }
    
      const { error: presentError } = await presentPaymentSheet();
    
      setLoading(false);
    
      if (presentError) {
        alert(`Payment failed: ${presentError.message}`);
      } else {
        alert('Payment succeeded!');
        //navigation.navigate('PaymentOptions'); // Navigate after successful payment
      }
    };

    const handleSetAppointment = () => {
        console.log('Set Appointment Button Pressed');
        navigation.navigate('PaymentOptions');
        console.log('Navigated to Set Appointment Screen'); 
    }

    return (
        <View style={[globalStyles.container, {backgroundColor: '#F0DEAE'}]}>
        {/* Back Button and Title */}
        <View style={globalStyles.headerContainer}>
        <View style={globalStyles.backButtonContainer}>
            <Image
                source={require('../assets/images/Back_Icon.png')}
                style={[globalStyles.icon, globalStyles.backIcon]}
            />
            <Text style={[globalStyles.subtitle, globalStyles.backText]}>New Appointment</Text>
        </View>
        </View>
        <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
          
    
          {/* Month and Year */}
            <View>
                <Text style={styles.monthText}>
                {new Date().toLocaleString('en-US', { month: 'long' })},{' '}
                {new Date().getFullYear()}
                </Text>
            </View>

            {/* Date Selection */}
            <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            >
            <View style={styles.datesContainer}>
                {currentWeekDates.map((date) => (
                <TouchableOpacity
                    key={date.day}
                    style={[
                    styles.dateBox,
                    selectedDate === date.day && styles.selectedDateBox,
                    ]}
                    onPress={() => setSelectedDate(date.day)}
                >
                    <Text
                    style={[
                        styles.dateText,
                        selectedDate === date.day && styles.selectedDateText,
                    ]}
                    >
                    {date.day}
                    </Text>
                    <Text
                    style={[
                        styles.dateLabel,
                        selectedDate === date.day && styles.selectedDateText,
                    ]}
                    >
                    {date.label}
                    </Text>
                </TouchableOpacity>
                ))}
            </View>
            </ScrollView>
    
          {/* Available Time */}
          <Text style={styles.sectionTitle}>Available Time</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            >
            <View style={styles.timeContainer}>
                {times.map((time) => (
                <TouchableOpacity
                    key={time}
                    style={[
                    styles.timeBox,
                    selectedTime === time && styles.selectedTimeBox,
                    ]}
                    onPress={() => setSelectedTime(time)}
                >
                    <Text
                    style={[
                        styles.timeText,
                        selectedTime === time && styles.selectedTimeText,
                    ]}
                    >
                    {time}
                    </Text>
                </TouchableOpacity>
                ))}
            </View>
          </ScrollView>

          {/* Patient Details */}
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          
            
          {/* Problem Input */}
          <TextInput
            style={styles.textArea}
            placeholder="Write your problem"
            placeholderTextColor="#7D7D7D"
            multiline
            numberOfLines={4}
          />
    
          {/* Set Appointment Button */}
          <TouchableOpacity style={styles.appointmentButton} onPress={openPaymentSheet} disabled={loading}>
            <Text style={styles.appointmentButtonText}>{loading ? 'Processing...' : 'Set Appointment'}</Text>
          </TouchableOpacity>
        </ScrollView>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: responsiveMargin(25),
      },
      monthText: {
        fontSize: responsiveFontSize(16),
        color: '#4E240D',
      },
      datesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: responsiveMargin(20),
      },
      dateBox: {
        alignItems: 'center',
        paddingVertical: responsiveMargin(15),
        width: width/5,
        borderRadius: 12,
        marginHorizontal: responsiveMargin(7),
        backgroundColor: '#F7E8C5',
      },
      selectedDateBox: {
        backgroundColor: '#BC6C25',
      },
      dateText: {
        fontSize: responsiveFontSize(17),
        marginBottom: responsiveMargin(17),
        color: '#4E240D',
      },
      selectedDateText: {
        color: '#FFF',
      },
      dateLabel: {
        fontSize: responsiveFontSize(10),
        color: '#7D7D7D',
      },
      sectionTitle: {
        fontSize: responsiveFontSize(16),
        color: '#4E240D',
        fontWeight: 'bold',
        marginVertical: responsiveMargin(20),
      },
      timeContainer: {
        width: width/0.8,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
      },
      timeBox: {
        width: width / 4,
        paddingVertical: responsiveMargin(12),
        paddingHorizontal: responsiveMargin(5),
        margin: responsiveMargin(5),
        borderRadius: 8,
        backgroundColor: '#F7E8C5',
        alignItems: 'center',
      },
      selectedTimeBox: {
        backgroundColor: '#BC6C25',
      },
      timeText: {
        fontSize: responsiveFontSize(13),
        color: '#4E240D',
      },
      selectedTimeText: {
        color: '#FFF',
      },
      textArea: {
        width: '100%',
        height: height / 6,
        padding: responsiveMargin(10),
        marginBottom:responsiveMargin(40),
        borderRadius: 8,
        backgroundColor: '#F7E8C5',
        textAlignVertical: 'top',
        fontSize: responsiveFontSize(14),
        color: '#4E240D',
      },
      appointmentButton: {
        width: '100%',
        paddingVertical: responsiveMargin(15),
        borderRadius: 14,
        backgroundColor: '#BC6C25',
        alignItems: 'center',
        marginBottom: responsiveMargin(40),
      },
      appointmentButtonText: {
        fontSize: responsiveFontSize(14),
        color: '#FFF',
      },
    });