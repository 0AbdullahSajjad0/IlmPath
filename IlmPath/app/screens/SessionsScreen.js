import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { width, height, responsiveMargin, responsiveFontSize, globalStyles } from '../styles/globalStyles';

export default function SessionsScreen({ navigation }) {
  const [data, setData] = useState([]); // Replace with actual data logic

  const handleNewSession = () => {
    console.log('New Session Pressed');
    navigation.navigate('UllamaList');
    console.log('Navigated to Ullama List');
  };

  return (
    <View style={[globalStyles.container, { backgroundColor: '#F0DEAE' }]}>
      {/* Back Button */}
      <View style={globalStyles.headerContainer}>
        <View style={globalStyles.backButtonContainer}>
          <Text style={[globalStyles.subtitle, globalStyles.backText]}>Sessions</Text>
          <TouchableOpacity style={styles.rowButton} onPress={handleNewSession}>
            <Text style={styles.rowButtonText}>New Session</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          globalStyles.formContainer,
          {  flexGrow: 1 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {data.length > 0 ? (
          // Display list when data exists
          data.map((item, index) => (
            <TouchableOpacity key={index} style={styles.listItem}>
              <Text style={styles.listItemText}>{item}</Text>
            </TouchableOpacity>
          ))
        ) : (
          // Display image and text when no data exists
          <View style={styles.emptyContainer}>
            <Image
              source={require('../assets/images/IlmPath_Splash.png')} // Replace with your image path
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>Book a session to avail services</Text>
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
