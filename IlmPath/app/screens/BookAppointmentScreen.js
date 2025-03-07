import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { width, height, responsiveIconSize, responsiveMargin, responsiveFontSize, ProfileBox, globalStyles, NoteIcon } from '../styles/globalStyles';
import { LinearGradient } from 'expo-linear-gradient'; // Import from expo-linear-gradient
import {Svg, Path} from 'react-native-svg';
import {React, useState, useEffect} from 'react'
import { useStripe } from '@stripe/stripe-react-native';
import { fetchPaymentIntentClientSecret } from '../services/ullamaService';
import { fetchAvailableTimes, checkExistingAppointment, bookAppointment } from '../services/appointmentService'; // Import the service
import { useUser } from '../../context/UserContext';

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

// Helper function to convert time string to 24-hour format
const convertTimeTo24Hour = (timeStr) => {
  if (!timeStr) return "";
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":");
  if (modifier.toLowerCase() === "pm" && hours !== "12") {
    hours = parseInt(hours, 10) + 12;
  }
  if (modifier.toLowerCase() === "am" && hours === "12") {
    hours = "00";
  }
  return `${hours.toString().padStart(2, "0")}:${minutes}:00`;
};

export default function BookAppointmentScreen({navigation, route}) {

    const { user } = useUser();
    const { ulama } = route.params;
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(14); // Example selected date
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(''); // Example selected time
    const currentWeekDates = getCurrentWeekDates();
    const [problem, setProblem] = useState('');
  
    useEffect(() => {
      if (!selectedDate) return;
      const getAvailableTimes = async () => {
        console.log("Fetching available times for", selectedDate);
        const formattedDate = `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${selectedDate.toString().padStart(2, "0")}`;
        console.log("Formatted date:", formattedDate);
        const times = await fetchAvailableTimes(ulama.id, formattedDate);
        setAvailableTimes(times);
        console.log("Available times:", times);
      };
    
      getAvailableTimes();
    }, [selectedDate]);
    
    
  
    const openPaymentSheet = async () => {
      setLoading(true);

      // ✅ Check for existing active appointment
      const existingAppointment = await checkExistingAppointment(user.id, ulama.id);

      if (existingAppointment.exists) {
        alert('You already have an active appointment with this Ulama.');
        setLoading(false);
        return;
      }
    
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
    
      if (presentError) {
        alert(`Payment failed: ${presentError.message}`);
        setLoading(false);
        return;
      }

      // Build appointment_date using the current year, month, and selected day.
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = selectedDate.toString().padStart(2, '0');
      const appointment_date = `${year}-${month}-${day}`;
      // Convert selected time (e.g., "09:00 AM") to 24-hour format (e.g., "09:00:00")
      const appointment_time = convertTimeTo24Hour(selectedTime);

      const student_id = user.id;
      const ulama_id = ulama.id; // Replace with actual ulama ID
      const appointment = await bookAppointment({
        student_id,
        ulama_id,
        appointment_date,
        appointment_time,
        appointment_details: problem, // Replace with actual problem description
      });

      setLoading(false);

      if (appointment) {
        alert('Payment and appointment booking succeeded!');
        // Optionally, navigate to an appointment confirmation screen:
        // navigation.navigate('AppointmentConfirmation', { appointment });
      } else {
        alert('Payment succeeded, but appointment booking failed.');
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
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../assets/images/Back_Icon.png')}
                        style={[globalStyles.icon, globalStyles.backIcon]}
                    />
                </TouchableOpacity>
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
                {availableTimes.map((time) => (
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
            multiline={true}
            value={problem}
            onChangeText={setProblem}
            scrollEnabled={true}
            enablesReturnKeyAutomatically={true}
            textBreakStrategy="simple"
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
        flexWrap: 'wrap',
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