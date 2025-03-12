import React, { createContext, useContext, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { UserProvider } from './context/UserContext';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StripeProvider } from '@stripe/stripe-react-native'; 
import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';

import LoginOptionsScreen from './app/screens/LoginOptionsScreen';
import EmailSignIn from './app/screens/EmailSignIn';
import SignUpScreen from './app/screens/SignUpScreen';
import StudentSignUp from './app/screens/StudentSignUp';
import UllamaSignUp from './app/screens/UllamaSignUp';
import ChatbotScreen from './app/screens/ChatbotScreen';
import ChatbotResultScreen from './app/screens/ChatbotResultScreen';
import SurahFinderScreen from './app/screens/SurahFinderScreen';
import ReadSurah from './app/screens/ReadSurah';
import DailyRecitationScreen from './app/screens/DailyRecitationScreen';
import AllSurahListScreen from './app/screens/AllSurahListScreen';
import LessonsScreen from './app/screens/LessonsScreen';
import LessonDetailScreen from './app/screens/LessonDetailScreen';
import OpenSessionScreen from './app/screens/OpenSessionScreen';
import EditSessions from './app/screens/EditSessions';
import UllamaList from './app/screens/UllamaList';
import UllamaDescriptionScreen from './app/screens/UllamaDescriptionScreen';
import BookAppointmentScreen from './app/screens/BookAppointmentScreen';
import BottomTabNavigator from './app/navigation/BottomTabNavigator';


const Tab = createBottomTabNavigator();
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();


export default function App() {
  const [isReady, setIsReady] = React.useState(false);

  const [fontsLoaded] = useFonts({
    'Atma-Bold': require('./app/assets/fonts/Atma-Bold.ttf'),
    'Atma-Regular': require('./app/assets/fonts/Atma-Regular.ttf'),
    'Jost-SemiBold': require('./app/assets/fonts/Jost-SemiBold.ttf'),
    'NotoNaskhArabic-Regular': require('./app/assets/fonts/NotoNaskhArabic-Regular.ttf'),
    'NotoNaskhArabic-Bold': require('./app/assets/fonts/NotoNaskhArabic-Bold.ttf'),
  });

  const [dataLoaded] = require('./app/assets/data/QuranDataInJson.json');


  React.useEffect(() => {
    async function loadResources() {
      try {
        // Load image and fonts in parallel
        
        const imageAsset1 = Asset.fromModule(require('./app/assets/images/IlmPath_Splash.png')).downloadAsync();
        const imageAsset2 = Asset.fromModule(require('./app/assets/images/QuranLogo.png')).downloadAsync();
        const imageAsset3 = Asset.fromModule(require('./app/assets/images/horizontalBox_Picture.png')).downloadAsync();
        const imageAsset4 = Asset.fromModule(require('./app/assets/images/Surah_Background.png')).downloadAsync();
        await Promise.all([imageAsset1, imageAsset2, imageAsset3, imageAsset4, new Promise(resolve => setTimeout(resolve, 2000))]);

        if (fontsLoaded && dataLoaded) {
          setIsReady(true);
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error("Error loading resources:", error);
      }
    }

    loadResources();
  }, [fontsLoaded]);

  if (!isReady) {
    return null; // Keep the splash screen visible
  }

  return (
    <StripeProvider publishableKey="pk_test_51QUaXvLPk2ToxWUBho0AzIHu39CaDs0oUqJBRQGySGnq2ZtlOqjMbE2d7s4hmh0lW3riGUFrMEzZBPOp2QAjc46K00RlxUAJjb"> 
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Options" component={LoginOptionsScreen} />
          <Stack.Screen name="EmailSignIn" component={EmailSignIn} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="StudentSignUp" component={StudentSignUp} />
          <Stack.Screen name="UllamaSignUp" component={UllamaSignUp} />
          <Stack.Screen name="SignIn" component={EmailSignIn} />

          <Stack.Screen name="HomeTabs" component={BottomTabNavigator} />
          <Stack.Screen name="Chatbot" component={ChatbotScreen} />
          <Stack.Screen name="ChatbotResult" component={ChatbotResultScreen} />
          <Stack.Screen name="SurahFinder" component={SurahFinderScreen} />
          <Stack.Screen name="ReadSurah" component={ReadSurah} />  
          <Stack.Screen name="SurahList" component={AllSurahListScreen} />
          <Stack.Screen name="DailyRecitationScreen" component={DailyRecitationScreen} />
          <Stack.Screen name="LessonsScreen" component={LessonsScreen} />
          <Stack.Screen name="LessonDetailScreen" component={LessonDetailScreen} />
          <Stack.Screen name="OpenSession" component={OpenSessionScreen} options={{gestureEnabled: false,headerBackVisible: false,}} />
          <Stack.Screen name="EditSessions" component={EditSessions} />
          <Stack.Screen name="UllamaList" component={UllamaList} />
          <Stack.Screen name="UllamaDescription" component={UllamaDescriptionScreen} />
          <Stack.Screen name="BookAppointment" component={BookAppointmentScreen}/>  

        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
    </StripeProvider>
  );
}