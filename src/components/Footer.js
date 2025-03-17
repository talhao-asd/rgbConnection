import { View, TouchableOpacity } from 'react-native'
import React, { memo, useState, useCallback, useEffect, useRef } from 'react'
import Icon from 'react-native-vector-icons/Feather'
import base64 from 'react-native-base64'

const SERVICE_UUID = '00000180-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '0000dead-0000-1000-8000-00805f9b34fb';

// This can be the most recently connected device ID from your app
const LAST_KNOWN_DEVICE_ID = 'EC:DA:3B:B6:B6:AE'; // Replace with your device ID

// Default values
const DEFAULT_MODE = "Y"; // Y = Yıldız mode
const DEFAULT_LED_COUNT = "1"; // 1 = 12 LED
const DEFAULT_ANIMATION_MODE = "1"; // Animation mode 1
const DEFAULT_ANIMATION_SPEED = "01"; // Speed value 01-99
const DEFAULT_WAIT_TIME = "01"; // Wait time 01-99
const DEFAULT_BRIGHTNESS = "99"; // Brightness 01-99
const DEFAULT_RGB_ANIMATION = "00"; // RGB Animation 00-13
const DEFAULT_DIRECTION = "1"; // Direction for Kayanyıldız mode
const DEFAULT_RED_VALUE = "255"; // Red component for RGBW static color
const DEFAULT_GREEN_VALUE = "255"; // Green component for RGBW static color
const DEFAULT_BLUE_VALUE = "255"; // Blue component for RGBW static color
const DEFAULT_WHITE_VALUE = "0"; // White component for RGBW static color

const Footer = memo(({ 
  bleManager, 
  connectedDevice: externalDevice, 
  mode = DEFAULT_MODE,
  ledCount = DEFAULT_LED_COUNT,
  animationMode = DEFAULT_ANIMATION_MODE,
  animationSpeed = DEFAULT_ANIMATION_SPEED,
  waitTime = DEFAULT_WAIT_TIME,
  brightness = DEFAULT_BRIGHTNESS,
  rgbAnimation = DEFAULT_RGB_ANIMATION,
  direction = DEFAULT_DIRECTION,
  redValue = DEFAULT_RED_VALUE,
  greenValue = DEFAULT_GREEN_VALUE,
  blueValue = DEFAULT_BLUE_VALUE,
  whiteValue = DEFAULT_WHITE_VALUE,
  onStateChange, // Callback to notify parent components about power state changes
  sendImmediately = true // Whether to send command immediately on power button press
}) => {
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Store current values in a ref to avoid stale closures
  const valuesRef = useRef({
    mode,
    ledCount,
    animationMode,
    animationSpeed,
    waitTime,
    brightness,
    rgbAnimation,
    direction,
    redValue,
    greenValue,
    blueValue,
    whiteValue
  });
  
  // Update ref when props change
  useEffect(() => {
    valuesRef.current = {
      mode,
      ledCount,
      animationMode,
      animationSpeed,
      waitTime,
      brightness,
      rgbAnimation,
      direction,
      redValue,
      greenValue,
      blueValue,
      whiteValue
    };
  }, [
    mode,
    ledCount,
    animationMode,
    animationSpeed,
    waitTime,
    brightness,
    rgbAnimation,
    direction,
    redValue,
    greenValue,
    blueValue,
    whiteValue
  ]);

  // Try to use the provided device or connect to a known one
  useEffect(() => {
    if (externalDevice) {
      setConnectedDevice(externalDevice);
      return;
    }

    // Only try to connect if no device is connected and we have a bleManager
    if (!connectedDevice && !isConnecting && bleManager) {
      connectToDevice();
    }
  }, [externalDevice, bleManager]);

  const connectToDevice = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    try {
      console.log('Attempting to connect to device:', LAST_KNOWN_DEVICE_ID);
      const device = await bleManager.connectToDevice(LAST_KNOWN_DEVICE_ID);
      console.log('Connected to device directly from Footer:', device.id);
      
      await device.discoverAllServicesAndCharacteristics();
      console.log('Services and characteristics discovered');
      
      setConnectedDevice(device);
      
      const subscription = device.onDisconnected(() => {
        console.log('Device disconnected');
        setConnectedDevice(null);
      });
      
      return () => {
        subscription.remove();
      };
    } catch (error) {
      console.error('Error connecting to device:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const formatCommand = (isOn) => {
    let command = '>';
    
    // Use lowercase mode letter when turning OFF, uppercase when turning ON
    const values = valuesRef.current; // Get current values from the ref
    const modeChar = isOn ? values.mode.toUpperCase() : values.mode.toLowerCase();
    command += modeChar;
    
    console.log(`Command formatting - Target power state: ${isOn ? 'ON' : 'OFF'}, using mode character: ${command}`);
    
    // Different format based on mode
    switch (values.mode.toUpperCase()) {
      case 'K': // Kayanyıldız
        command += `${values.ledCount}${values.animationMode}${values.direction || '1'}${String(values.animationSpeed).padStart(2, '0')}${String(values.waitTime).padStart(2, '0')}`;
        break;
      case 'Y': // Yıldız
        command += `${values.ledCount}${values.animationMode}${String(values.animationSpeed).padStart(2, '0')}${String(values.waitTime).padStart(2, '0')}`;
        break;
      case 'R': // RGBW animation
        command += `${String(values.rgbAnimation).padStart(2, '0')}${String(values.animationSpeed).padStart(2, '0')}${String(values.brightness).padStart(2, '0')}`;
        break;
      case 'S': // RGBW Sabit Renk
        // For RGBW static color, we need brightness and RGBW values
        const r = String(values.redValue || '255').padStart(3, '0');
        const g = String(values.greenValue || '255').padStart(3, '0');
        const b = String(values.blueValue || '255').padStart(3, '0');
        const w = String(values.whiteValue || '0').padStart(3, '0');
        command += `${String(values.brightness).padStart(2, '0')}${r}${g}${b}${w}`;
        break;
      default:
        // Default format if no specific mode is recognized
        command += `${values.ledCount}${values.animationMode}${values.animationSpeed}${values.waitTime}`;
    }
    
    // Close the command
    command += '|';
    
    console.log(`Final command created: ${command}`);
    return command;
  };

  const sendBLECommand = useCallback(async (isOn) => {
    try {
      if (!bleManager) {
        console.log('BLE Manager is not provided');
        return;
      }
      
      const device = connectedDevice || externalDevice;
      if (!device) {
        console.log('No device connected', {
          bleManager: !!bleManager,
          hasConnectedDevice: !!connectedDevice,
          hasExternalDevice: !!externalDevice
        });
        return;
      }

      // Format command string - explicitly pass the isOn parameter to use correct case
      const command = formatCommand(isOn);
      console.log(`About to send BLE command: ${command} to set device power: ${isOn ? 'ON' : 'OFF'}`);
      
      // Convert string to base64
      const base64Data = base64.encode(command);

      await bleManager.writeCharacteristicWithoutResponseForDevice(
        device.id,
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Data
      );
      
      console.log('Command sent successfully');
    } catch (error) {
      console.error('Error sending BLE command:', error);
    }
  }, [bleManager, connectedDevice, externalDevice]);

  const handlePowerPress = useCallback(() => {
    const newPowerState = !isPowerOn;
    console.log(`Power button pressed. Changing power state from ${isPowerOn ? 'ON' : 'OFF'} to ${newPowerState ? 'ON' : 'OFF'}`);
    setIsPowerOn(newPowerState);
    
    // Only send the command if sendImmediately is true
    if (sendImmediately) {
      console.log(`Sending command immediately with target power state: ${newPowerState ? 'ON' : 'OFF'}`);
      sendBLECommand(newPowerState);
    }
    
    // Always notify parent component about power state change
    if (onStateChange) {
      console.log(`Notifying parent component about power state change: ${newPowerState ? 'ON' : 'OFF'}`);
      onStateChange(newPowerState, connectedDevice || externalDevice);
    }
  }, [isPowerOn, sendBLECommand, onStateChange, connectedDevice, externalDevice, sendImmediately]);

  return (
    <View style={{
      position: 'absolute', 
      bottom: 0, 
      width: '100%', 
      alignItems: 'center', 
      justifyContent: 'center', 
      paddingVertical: 10, 
      marginBottom: 20
    }}>
      <TouchableOpacity 
        onPress={handlePowerPress}
        style={{
          padding: 10,
          borderRadius: 30,
          backgroundColor: isPowerOn ? 'rgba(40, 158, 112, 0.1)' : 'transparent'
        }}
      >
        <Icon 
          name="power" 
          size={48} 
          color={isPowerOn ? "#289E70" : "#666666"} 
        />
      </TouchableOpacity>
    </View>
  )
});

export default Footer