import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';

import LoginOptionsScreen from './app/screens/LoginOptionsScreen';
import EmailSignIn from './app/screens/EmailSignIn';
import SignUpScreen from './app/screens/SignUpScreen';
import StudentSignUp from './app/screens/StudentSignUp';
import UllamaSignUp from './app/screens/UllamaSignUp';
import ReadSurah from './app/screens/ReadSurah';
import DailyRecitationScreen from './app/screens/DailyRecitationScreen';
import AllSurahListScreen from './app/screens/AllSurahListScreen';
import UllamaList from './app/screens/UllamaList';
import UllamaDescriptionScreen from './app/screens/UllamaDescriptionScreen';
import BookAppointmentScreen from './app/screens/BookAppointmentScreen';
import BottomTabNavigator from './app/navigation/BottomTabNavigator';

// Prevent splash from auto-hiding
//const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();


export default function App() {
  const [isReady, setIsReady] = React.useState(false);

  const [fontsLoaded] = useFonts({
    'Atma-Bold': require('./app/assets/fonts/Atma-Bold.ttf'),
    'Atma-Regular': require('./app/assets/fonts/Atma-Regular.ttf'),
    'Jost-SemiBold': require('./app/assets/fonts/Jost-SemiBold.ttf'),
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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Options" component={LoginOptionsScreen} />
        <Stack.Screen name="EmailSignIn" component={EmailSignIn} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="StudentSignUp" component={StudentSignUp} />
        <Stack.Screen name="UllamaSignUp" component={UllamaSignUp} />
        <Stack.Screen name="SignIn" component={EmailSignIn} />

        <Stack.Screen name="HomeTabs" component={BottomTabNavigator} />
        <Stack.Screen name="ReadSurah" component={ReadSurah} />  
        <Stack.Screen name="SurahList" component={AllSurahListScreen} />
        <Stack.Screen name="DailyRecitationScreen" component={DailyRecitationScreen} />
        <Stack.Screen name="UllamaList" component={UllamaList} />
        <Stack.Screen name="UllamaDescription" component={UllamaDescriptionScreen} />
        <Stack.Screen name="BookAppointment" component={BookAppointmentScreen}/>  

      </Stack.Navigator>
    </NavigationContainer>
  );
}