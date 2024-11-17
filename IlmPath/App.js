import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';

import LoginOptionsScreen from './app/screens/LoginOptionsScreen';
import EmailSignIn from './app/screens/EmailSignIn';
import SignUpScreen from './app/screens/SignUpScreen';

// Prevent splash from auto-hiding
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();


export default function App() {
  const [isReady, setIsReady] = React.useState(false);

  const [fontsLoaded] = useFonts({
    'Atma-Bold': require('./app/assets/fonts/Atma-Bold.ttf'),
    'Atma-Regular': require('./app/assets/fonts/Atma-Regular.ttf'),
    'Jost-SemiBold': require('./app/assets/fonts/Jost-SemiBold.ttf'),
  });

  React.useEffect(() => {
    async function loadResources() {
      try {
        // Load image and fonts in parallel
        const imageAsset = Asset.fromModule(require('./app/assets/QuranLogo.png')).downloadAsync();
        await Promise.all([imageAsset, new Promise(resolve => setTimeout(resolve, 2000))]);

        if (fontsLoaded) {
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
        <Stack.Screen name="SignIn" component={EmailSignIn} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
