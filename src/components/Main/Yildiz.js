import {View, SafeAreaView} from 'react-native';
import React, {memo, useMemo, useState, useCallback, useEffect} from 'react';
import AnimationMode from '../Yildiz/AnimationMode';
import Speed from '../Yildiz/Speed';
import Footer from '../Footer';
import {useSelector, useDispatch} from 'react-redux';
import {BleManager} from 'react-native-ble-plx';
import base64 from 'react-native-base64';

const SERVICE_UUID = '00000180-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '0000dead-0000-1000-8000-00805f9b34fb';

const Yildiz = memo(() => {
  const [bleManager] = useState(() => new BleManager());
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  
  // Use more specific selectors to prevent unnecessary re-renders
  const yildizState = useSelector(state => state.yildiz);
  const dispatch = useDispatch();
  
  // Format command based on current parameters
  const formatCommand = (isOn) => {
    // The mode letter is uppercase if ON, lowercase if OFF
    const modeChar = isOn ? 'Y' : 'y';
    const {animationMode, animationSpeed, waitingTime, moduleCount} = yildizState;
    
    // Format speed and wait time as two digits
    const speedFormatted = animationSpeed?.toString().padStart(2, '0') || "01";
    const waitTimeFormatted = waitingTime?.toString().padStart(2, '0') || "01";
    
    // Use moduleCount from Redux state
    return `>${modeChar}${moduleCount}${animationMode || "1"}${speedFormatted}${waitTimeFormatted}|`;
  };
  
  // Send command to device
  const sendCommand = useCallback(async () => {
    if (!isPowerOn || !connectedDevice) {
      console.log('Cannot send command: power is off or no device connected');
      return;
    }
    
    try {
      const command = formatCommand(true);
      console.log('Sending command:', command);
      
      // Convert string to base64
      const base64Data = base64.encode(command);
      
      await bleManager.writeCharacteristicWithoutResponseForDevice(
        connectedDevice.id,
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Data
      );
      
      console.log('Command sent successfully');
    } catch (error) {
      console.error('Error sending BLE command:', error);
    }
  }, [bleManager, connectedDevice, isPowerOn, yildizState]);
  
  // Listen for changes in animation parameters and send command immediately
  useEffect(() => {
    if (isPowerOn && connectedDevice) {
      sendCommand();
    }
  }, [
    yildizState.animationMode,
    yildizState.animationSpeed,
    yildizState.waitingTime,
    yildizState.moduleCount, // Add moduleCount to dependencies
    sendCommand
  ]);
  
  // Handle power state changes
  const handlePowerChange = useCallback(async (isOn, device) => {
    console.log(`Yildiz handlePowerChange: Power state changed to ${isOn ? 'ON' : 'OFF'}`);
    setIsPowerOn(isOn);
    
    if (device && !connectedDevice) {
      setConnectedDevice(device);
    }
    
    // Send command with appropriate case (y/Y) based on power state
    if (device) {
      try {
        const command = formatCommand(isOn);
        console.log(`Sending power ${isOn ? 'ON' : 'OFF'} command: ${command}`);
        
        // Convert string to base64
        const base64Data = base64.encode(command);
        
        await bleManager.writeCharacteristicWithoutResponseForDevice(
          device.id,
          SERVICE_UUID,
          CHARACTERISTIC_UUID,
          base64Data
        );
        
        console.log('Power command sent successfully');
      } catch (error) {
        console.error('Error sending power command:', error);
      }
    }
  }, [bleManager, connectedDevice, formatCommand, yildizState]);

  // Get moduleCount from Redux
  const moduleCount = useSelector(state => state.yildiz.moduleCount);

  // Memoize child components to prevent unnecessary re-renders
  const animationModeComponent = useMemo(
    () => <AnimationMode moduleCount={moduleCount} />,
    [moduleCount],
  );
  const speedComponent = useMemo(
    () => <Speed moduleCount={moduleCount} />,
    [moduleCount],
  );
  const footerComponent = useMemo(
    () => (
      <Footer 
        bleManager={bleManager}
        connectedDevice={connectedDevice}
        mode="Y" // Y for Yildiz mode
        ledCount={moduleCount.toString()} // Use moduleCount from Redux
        animationMode={yildizState?.animationMode || "1"}
        animationSpeed={yildizState?.animationSpeed?.toString().padStart(2, '0') || "01"}
        waitTime={yildizState?.waitingTime?.toString().padStart(2, '0') || "01"}
        onStateChange={handlePowerChange}
        sendImmediately={true} // Send immediately on power press to ensure proper command is sent
      />
    ),
    [bleManager, connectedDevice, yildizState, handlePowerChange, moduleCount],
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#080808'}}>
      <View style={{gap: 5}}>
        {animationModeComponent}
        {speedComponent}
      </View>
      {footerComponent}
    </SafeAreaView>
  );
});

export default Yildiz;
