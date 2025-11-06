import {View, SafeAreaView} from 'react-native';
import React, {memo, useMemo, useState, useCallback, useEffect, useRef} from 'react';
import ColorWheel from '../Rgb/ColorWheel';
import Speed from '../Rgb/Speed';
import Footer from '../Footer';
import {useSelector, useDispatch} from 'react-redux';
import base64 from 'react-native-base64';
import BLEService from '../../services/BLEService';

const SERVICE_UUID = '00000180-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '0000dead-0000-1000-8000-00805f9b34fb';

const Rgb = memo(() => {
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  
  // Access BLEService for potential reconnection
  const bleServiceRef = useRef(null);

  // Use more specific selectors to prevent unnecessary re-renders
  const rgbState = useSelector(state => state.rgb);
  const {bleDevice, deviceId, isConnected} = useSelector(state => state.device);
  const dispatch = useDispatch();

  // Initialize BLEService if needed
  useEffect(() => {
    bleServiceRef.current = new BLEService();
  }, []);

  // Set the connected device from Redux
  useEffect(() => {
    if (bleDevice) {
      console.log('RGB component received device from Redux:', deviceId);
      setConnectedDevice(bleDevice);
    }
  }, [bleDevice, deviceId]);

  // Handle reconnection attempts if device disconnects
  const attemptReconnect = useCallback(async () => {
    if (!deviceId || isReconnecting) return;
    
    try {
      setIsReconnecting(true);
      console.log('RGB component attempting to reconnect to device:', deviceId);
      
      if (bleServiceRef.current) {
        const success = await bleServiceRef.current.connectToDevice(deviceId);
        if (success) {
          // Update the connected device
          const reconnectedDevice = bleServiceRef.current.connectedDevices.get(deviceId);
          if (reconnectedDevice) {
            setConnectedDevice(reconnectedDevice);
            console.log('RGB successfully reconnected to device:', deviceId);
          }
        } else {
          console.log('RGB failed to reconnect to device');
        }
      }
    } catch (error) {
      console.error('Error during reconnection attempt:', error);
    } finally {
      setIsReconnecting(false);
    }
  }, [deviceId, isReconnecting]);

  // If device is null but we have a deviceId, try to reconnect
  useEffect(() => {
    if (deviceId && !connectedDevice && !isReconnecting) {
      console.log('Device connection lost, attempting to reconnect from RGB component');
      attemptReconnect();
    }
  }, [connectedDevice, deviceId, attemptReconnect, isReconnecting]);

  // Don't disconnect when component unmounts
  useEffect(() => {
    return () => {
      // No need to disconnect, as this would break other tabs
      console.log('RGB component unmounting, preserving device connection');
    };
  }, []);

  // Format command for RGB static color mode
  const formatCommand = useCallback(
    isOn => {
      // The mode letter is uppercase if ON, lowercase if OFF
      const modeChar = isOn ? 'S' : 's';
      const {color, speed} = rgbState;

      // Check if we're in white-only mode (w > 0)
      const isWhiteActive = color.w > 0;

      // Convert RGB values from 0-255 to 0-99 range
      const normalizeRgbValue = value => {
        // For white mode, we want to preserve the specific RGB values we set
        // Otherwise, enforce normal conversion for regular RGB mode
        if (isWhiteActive) {
          // Just padded the value as is, without scaling
          return String(value).padStart(2, '0');
        } else {
          // Normal RGB mode scaling from 0-255 to 1-99
          const normalized = Math.max(
            1,
            Math.min(99, Math.round((value / 255) * 99)),
          );
          return String(normalized).padStart(2, '0');
        }
      };

      // Format RGB values
      const r = normalizeRgbValue(color.r);
      const g = normalizeRgbValue(color.g);
      const b = normalizeRgbValue(color.b);

      // Use white value from state or default to "00"
      const w = color.w ? String(color.w).padStart(2, '0') : '00';

      // Format brightness (1-99)
      const brightness = String(speed).padStart(2, '0');

      // Create command in format ">S{brightness}{r}{g}{b}{w}|"
      return `>${modeChar}${brightness}${r}${g}${b}${w}|`;
    },
    [rgbState],
  );

  // Send command to device
  const sendCommand = useCallback(async () => {
    if (!isPowerOn || !connectedDevice) {
      console.log('Cannot send command: power is off or no device connected');
      return;
    }

    try {
      const command = formatCommand(isPowerOn);
      console.log('Sending RGB command:', command);

      // Convert string to base64 before sending
      const base64Command = base64.encode(command);

      await connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Command,
      );

      console.log('RGB command sent successfully');
    } catch (error) {
      console.error('Error sending RGB command:', error);
    }
  }, [connectedDevice, isPowerOn, formatCommand]);

  // Handle power toggle from Footer
  const handlePowerToggle = useCallback(
    async (isOn, device) => {
      console.log(`RGB power toggled to: ${isOn ? 'ON' : 'OFF'}`);
      setIsPowerOn(isOn);

      if (device && !connectedDevice) {
        setConnectedDevice(device);
      }

      // If we received a device from the Footer, use it
      const deviceToUse = device || connectedDevice;
      if (!deviceToUse) {
        console.log('No device available to send RGB command');
        return;
      }

      try {
        const command = formatCommand(isOn);
        console.log('Sending RGB command:', command);

        // Convert string to base64 before sending
        const base64Command = base64.encode(command);

        await deviceToUse.writeCharacteristicWithResponseForService(
          SERVICE_UUID,
          CHARACTERISTIC_UUID,
          base64Command,
        );

        console.log('RGB command sent successfully');
      } catch (error) {
        console.error('Error sending RGB command:', error);
      }
    },
    [connectedDevice, formatCommand],
  );

  // Effect to scan for devices when component mounts
  useEffect(() => {
    // Remove the automatic scanning and connection
    // This functionality should only happen in the dedicated RGBConnection screen
    
    // Cleanup function
    // return () => {
    //   if (connectedDevice) {
    //     connectedDevice.cancelConnection();
    //   }
    // };
  }, [connectedDevice]);

  // Effect to send command when rgb state changes
  useEffect(() => {
    if (isPowerOn && connectedDevice) {
      try {
        // Send command when any of the relevant parameters change
        console.log(`Sending command from RGB using device: ${connectedDevice.id}`);
        sendCommand();
      } catch (error) {
        console.error('Error in RGB command effect:', error);
      }
    }
  }, [isPowerOn, connectedDevice, rgbState.color, rgbState.speed, sendCommand]);

  // Memoize child components to prevent unnecessary re-renders
  const colorWheelComponent = useMemo(() => <ColorWheel />, []);
  const speedComponent = useMemo(() => <Speed />, []);

  // Pass relevant props to Footer
  const footerComponent = useMemo(() => {
    return (
      <>
        <Footer
          bleManager={bleDevice}
          connectedDevice={connectedDevice}
          mode="S"
          onStateChange={handlePowerToggle}
          sendImmediately={false} // Let us handle the command sending
          brightness={rgbState.speed.toString().padStart(2, '0')}
          redValue={rgbState.color.r.toString()}
          greenValue={rgbState.color.g.toString()}
          blueValue={rgbState.color.b.toString()}
          whiteValue={rgbState.color.w ? rgbState.color.w.toString() : '0'}
        />

      </>
    );
  }, [bleDevice, connectedDevice, handlePowerToggle, rgbState]);

  return (
    <SafeAreaView style={{flex: 1, gap: 10}}>
      {colorWheelComponent}
      {speedComponent}
      {footerComponent}
    </SafeAreaView>
  );
});

export default Rgb;
