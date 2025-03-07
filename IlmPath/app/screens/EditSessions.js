import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, KeyboardAvoidingView, Platform  } from 'react-native';
import { width, height, responsiveMargin, responsiveFontSize, globalStyles } from '../styles/globalStyles';
import DropDownPicker from 'react-native-dropdown-picker';

export default function EditSessions({ navigation }) {
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedDaysForTime, setSelectedDaysForTime] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unavailableDate, setUnavailableDate] = useState('');

  // List of days for selection
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Toggle sections
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Toggle day selection
  const toggleDaySelection = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={[globalStyles.container, { backgroundColor: '#F0DEAE'}]} 
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      {/* Header */}
      <View style={globalStyles.headerContainer}>
        <View style={globalStyles.backButtonContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                    source={require('../assets/images/Back_Icon.png')}
                    style={[globalStyles.icon, globalStyles.backIcon]}
                />
            </TouchableOpacity>
            <Text style={[globalStyles.subtitle, globalStyles.backText]}>Edit Sessions</Text>
        </View>
      </View>
      <View style={styles.mainContainer}>

        {/* 1️⃣ Edit Session Days */}
        <TouchableOpacity style={styles.box} onPress={() => toggleSection('days')}>
          <Text style={styles.boxText}>Edit Session Days</Text>
        </TouchableOpacity>
        {expandedSection === 'days' && (
          <View style={styles.expandedSection}>
            <View style={styles.horizontalScroll}>
              {daysOfWeek.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayBox,
                    selectedDays.includes(day) && styles.selectedDayBox,
                  ]}
                  onPress={() => toggleDaySelection(day)}
                >
                  <Text style={styles.dayText}>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={() => toggleSection(null)}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 2️⃣ Edit Session Timings */}
        <TouchableOpacity style={styles.box} onPress={() => {toggleSection('timing'); setDropdownOpen(false);}}>
          <Text style={styles.boxText}>Edit Session Timings</Text>
        </TouchableOpacity>
        {expandedSection === 'timing' && (
          <View style={styles.expandedSection}>
            <View style={styles.timeInputsContainer}>
              <TextInput
                style={styles.input}
                placeholder="Start Time (HH:MM)"
                value={startTime}
                onChangeText={setStartTime}
              />
              <TextInput
                style={styles.input}
                placeholder="End Time (HH:MM)"
                value={endTime}
                onChangeText={setEndTime}
              />
              <DropDownPicker
                items={daysOfWeek.map((day) => ({ label: day, value: day }))}
                multiple={true}
                min={1}
                max={7}
                open={dropdownOpen}
                setOpen={setDropdownOpen}
                value={selectedDaysForTime}
                setValue={setSelectedDaysForTime}
                containerStyle={styles.dropdown}
                placeholder="Select Days"
                style={{ borderWidth: 0 }} 
                dropDownContainerStyle={{ borderWidth: 0, zIndex: 2000 }}
                textStyle={{ color: '#4E240D'}}
              />
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={() => {toggleSection(null); setDropdownOpen(false);}}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 3️⃣ Make Date Unavailable */}
        <TouchableOpacity style={styles.box} onPress={() => toggleSection('date')}>
          <Text style={styles.boxText}>Make Date Unavailable</Text>
        </TouchableOpacity>
        {expandedSection === 'date' && (
          <View style={styles.expandedSection}>
            <TextInput
              style={styles.dateInput}
              placeholder="Enter Date (YYYY-MM-DD)"
              value={unavailableDate}
              onChangeText={setUnavailableDate}
            />
            <TouchableOpacity style={styles.confirmButton} onPress={() => toggleSection(null)}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </KeyboardAvoidingView>
  );
}

// Styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,  // Ensure it takes the full screen height
    padding: responsiveMargin(20),
    justifyContent: 'flex-start', // Align items from the top
  },
  box: {
    backgroundColor: '#BC6C25',
    paddingVertical: responsiveMargin(15),
    paddingHorizontal: responsiveMargin(20),
    borderRadius: 12,
    marginBottom: responsiveMargin(10),
    alignItems: 'center',
  },
  boxText: {
    fontSize: responsiveFontSize(16),
    fontFamily: 'Jost-SemiBold',
    color: 'white',
  },
  expandedSection: {
    backgroundColor: '#F7E8C5',
    padding: responsiveMargin(15),
    borderRadius: 12,
    marginBottom: responsiveMargin(20),
  },
  horizontalScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: responsiveMargin(15),
  },
  dayBox: {
    paddingVertical: responsiveMargin(10),
    paddingHorizontal: responsiveMargin(15),
    borderRadius: 8,
    backgroundColor: '#EAC98F',
    margin: responsiveMargin(5),
  },
  selectedDayBox: {
    backgroundColor: '#BC6C25',
  },
  dayText: {
    fontSize: responsiveFontSize(14),
    fontFamily: 'Jost-SemiBold',
    color: '#4E240D',
  },
  timeInputsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: responsiveMargin(10),
    marginHorizontal: responsiveMargin(5),
    borderRadius: 8,
    fontSize: responsiveFontSize(14),
    color: '#4E240D',
  },
  dateInput: {
    backgroundColor: 'white',
    padding: responsiveMargin(10),
    marginHorizontal: responsiveMargin(5),
    borderRadius: 8,
    fontSize: responsiveFontSize(14),
    color: '#4E240D',
  },
  dropdown: {
    width: '40%',
    marginHorizontal: responsiveMargin(5),
  },
  confirmButton: {
    backgroundColor: '#BC6C25',
    paddingVertical: responsiveMargin(12),
    borderRadius: 8,
    alignItems: 'center',
    marginTop: responsiveMargin(10),
  },
  confirmButtonText: {
    fontSize: responsiveFontSize(14),
    fontFamily: 'Jost-SemiBold',
    color: 'white',
  },
});
