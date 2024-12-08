import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {responsiveFontSize, responsiveMargin} from '../styles/globalStyles';
import HomeScreen from '../screens/HomeScreen';
import SessionsScreen from '../screens/SessionsScreen';
import { Svg, Path } from 'react-native-svg';

const HomeIcon = ({ focused }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.8 3.31352C11.5111 2.77538 12.4889 2.77538 13.2 3.31352L20.2 8.61081C20.7036 8.99192 21 9.59004 21 10.2252V19.8108C21 20.9253 20.1046 21.8288 19 21.8288H5C3.89543 21.8288 3 20.9253 3 19.8108V10.2252C3 9.59004 3.29639 8.99192 3.8 8.61081L10.8 3.31352Z"
      fill={focused ? '#BC6C25' : 'black'} // Change color based on focus
    />
  </Svg>
);

const LessonIcon = ({ focused }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 5.78142C4 4.10964 5.34315 2.75439 7 2.75439H18C19.1046 2.75439 20 3.65789 20 4.77241V17.8794C20 18.0485 19.9623 18.2038 19.8872 18.3554L19.3416 19.4563C19.2009 19.7404 19.2009 20.0747 19.3416 20.3588L19.8854 21.4561C19.9586 21.5964 20 21.7561 20 21.9256C20 22.4828 19.5523 22.9346 19 22.9346H7C5.34315 22.9346 4 21.5793 4 19.9075V5.78142ZM7 18.8985H17.4076C17.1789 19.5512 17.1789 20.2639 17.4076 20.9166H7C6.44772 20.9166 6 20.4648 6 19.9075C6 19.3503 6.44772 18.8985 7 18.8985ZM10 7.79944C9.44772 7.79944 9 8.25119 9 8.80845C9 9.36571 9.44772 9.81746 10 9.81746H14C14.5523 9.81746 15 9.36571 15 8.80845C15 8.25119 14.5523 7.79944 14 7.79944H10Z"
      fill={focused ? '#BC6C25' : 'black'} // Change color based on focus
    />
  </Svg>
);

const ProfileIcon = ({ focused }) => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z"
      fill={focused ? '#BC6C25' : 'black'} // Change color based on focus
    />
  </Svg>
);

const SessionsIcon = ({ focused }) => (
  <View style={{ marginTop: responsiveMargin(4) }}>
    <Svg width="25" height="25" viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.0007,0 C12.6497,0 15.1997,1.05 17.0697,2.93 C18.9497,4.811 20.0007,7.35 20.0007,10.01 C20.0007,13.51 18.1597,16.76 15.1597,18.57 C12.1597,20.38 8.4297,20.48 5.3307,18.83 L5.3307,18.83 L5.2997,18.83 C5.0007,18.71 4.7597,18.5 4.4797,18.36 C4.1707,18.23 3.8197,18.21 3.5007,18.311 C2.7597,18.57 2.0097,18.78 1.2397,18.96 C0.8397,18.97 0.7197,18.73 0.7197,18.34 C0.8997,17.55 1.1397,16.769 1.4207,16.01 C1.5297,15.68 1.5007,15.33 1.3307,15.019 L1.3307,15.019 L1.1307,14.63 C0.3897,13.22 0.0007,11.65 0.0007,10.061 L0.0007,10.061 L0.0007,10 C0.0007,7.35 1.0497,4.8 2.9297,2.93 C4.8097,1.05 7.3497,0 10.0007,0 Z M14.6097,8.73 C13.9097,8.73 13.3307,9.3 13.3307,10.01 C13.3307,10.71 13.9097,11.29 14.6097,11.29 C15.3197,11.29 15.8897,10.71 15.8897,10.01 C15.8897,9.3 15.3197,8.73 14.6097,8.73 Z M10.0007,8.73 C9.2907,8.73 8.7197,9.3 8.7197,10.01 C8.7197,10.71 9.2907,11.29 10.0007,11.29 C10.7107,11.29 11.2797,10.71 11.2797,10.01 C11.2797,9.3 10.7107,8.73 10.0007,8.73 Z M5.3897,8.73 C4.6797,8.73 4.1097,9.3 4.1097,10.01 C4.1097,10.71 4.6797,11.29 5.3897,11.29 C6.0897,11.29 6.6707,10.71 6.6707,10.01 C6.6707,9.3 6.0897,8.73 5.3897,8.73 Z"
        fill={focused ? '#BC6C25' : 'black'} // Change color based on focus
      />
    </Svg>
  </View>
);

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          if (route.name === 'Home') {
            return <HomeIcon focused={focused} />;
          } else if (route.name === 'Lesson') {
            return <LessonIcon focused={focused} />;
          } else if (route.name === 'Session') {
            return <SessionsIcon focused={focused} />;
          } else if (route.name === 'Profile') {
            return <ProfileIcon focused={focused} />;
          }
        },
        tabBarActiveTintColor: '#BC6C25',
        tabBarInactiveTintColor: 'black',
        tabBarIconStyle: {
          alignSelf: 'center',
          marginTop: responsiveMargin(3), // Slightly adjust icon position if needed
        },
        tabBarLabelStyle: {
          fontSize: responsiveFontSize(10),
        },
        tabBarStyle: {
          backgroundColor: '#E0B15E',
        },
        headerShown: false, // Hide header for bottom tab screens
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Lesson" component={HomeScreen} />
      <Tab.Screen name="Session" component={SessionsScreen} />
      <Tab.Screen name="Profile" component={HomeScreen} />
    </Tab.Navigator>
  );
}
