import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RGBConnection from './src/screens/RGBConnection';
import DeviceControlScreen from './src/screens/DeviceControlScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RGBConnection">
        <Stack.Screen 
          name="RGBConnection" 
          component={RGBConnection}
          options={{ title: 'Connect Device' }}
        />
        <Stack.Screen 
          name="DeviceControl" 
          component={DeviceControlScreen}
          options={{ title: 'Device Control' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App; 