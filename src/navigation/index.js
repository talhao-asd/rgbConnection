import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BackHandler } from 'react-native';
import LoadingComponent from '../components/LoadingComponent';
import WelcomeScreen from '../screens/WelcomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HomeScreen from '../screens/HomeScreen';
import RGBConnection from '../screens/RGBConnection';
import DeviceControlScreen from '../screens/DeviceControlScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  // Disable hardware back button for the entire app
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Return true to prevent default behavior (going back)
      return true;
    });

    return () => backHandler.remove();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome" 
        screenOptions={{ 
          headerShown: false,
          gestureEnabled: false // Disable swipe back gesture
        }}
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="RGBConnection" 
          component={RGBConnection} 
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="DeviceControl" 
          component={DeviceControlScreen} 
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
