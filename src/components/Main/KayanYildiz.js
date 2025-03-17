import {View, SafeAreaView} from 'react-native';
import React, {memo, useMemo, useState, useCallback, useEffect} from 'react';
import AnimationMod from '../KayanYildiz/AnimationMod';
import Speed from '../KayanYildiz/Speed';
import Direction from '../KayanYildiz/Direction';
import Footer from '../Footer';
import {useSelector} from 'react-redux';
import {BleManager} from 'react-native-ble-plx';
import base64 from 'react-native-base64';

const SERVICE_UUID = '00000180-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '0000dead-0000-1000-8000-00805f9b34fb';

const KayanYildiz = memo(({moduleCount = 1}) => {
  const [bleManager] = useState(() => new BleManager());
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  
  // Use more specific selectors to prevent unnecessary re-renders
  const kayanYildizState = useSelector(state => state.kayanYildiz);
  
  // Format command based on current parameters
  const formatCommand = useCallback((isOn) => {
    // The mode letter is uppercase if ON, lowercase if OFF
    const modeChar = isOn ? 'K' : 'k';
    const {animationMode, animationSpeed, waitingTime, direction} = kayanYildizState;
    
    // Format speed and wait time as two digits
    const speedFormatted = animationSpeed?.toString().padStart(2, '0') || "01";
    const waitTimeFormatted = waitingTime?.toString().padStart(2, '0') || "01";
    const directionValue = direction === 'right' ? '1' : '0';
    
    // Format: >K1110101| where:
    // K = mode (uppercase for ON, lowercase for OFF)
    // 1 = module count
    // 1 = animation mode
    // 1 = direction (1 for right, 0 for left)
    // 01 = animation speed
    // 01 = waiting time
    return `>${modeChar}${moduleCount}${animationMode || "1"}${directionValue}${speedFormatted}${waitTimeFormatted}|`;
  }, [kayanYildizState, moduleCount]);
  
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
  }, [bleManager, connectedDevice, isPowerOn, formatCommand]);
  
  // Listen for changes in animation parameters and send command immediately
  useEffect(() => {
    if (isPowerOn && connectedDevice) {
      sendCommand();
    }
  }, [
    kayanYildizState.animationMode,
    kayanYildizState.animationSpeed,
    kayanYildizState.waitingTime,
    kayanYildizState.direction,
    sendCommand
  ]);
  
  // Handle power state changes
  const handlePowerChange = useCallback(async (isOn, device) => {
    console.log(`KayanYildiz handlePowerChange: Power state changed to ${isOn ? 'ON' : 'OFF'}`);
    setIsPowerOn(isOn);
    
    if (device && !connectedDevice) {
      setConnectedDevice(device);
    }
    
    // Send command with appropriate case (k/K) based on power state
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
  }, [bleManager, connectedDevice, formatCommand]);

  // Memoize child components to prevent unnecessary re-renders
  const animationModComponent = useMemo(
    () => <AnimationMod moduleCount={moduleCount} />,
    [moduleCount],
  );
  const speedComponent = useMemo(
    () => <Speed moduleCount={moduleCount} />,
    [moduleCount],
  );
  const directionComponent = useMemo(
    () => <Direction moduleCount={moduleCount} />,
    [moduleCount],
  );
  const footerComponent = useMemo(
    () => (
      <Footer 
        bleManager={bleManager}
        connectedDevice={connectedDevice}
        mode="K" // K for KayanYildiz mode
        ledCount={moduleCount.toString()}
        animationMode={kayanYildizState?.animationMode || "1"}
        animationSpeed={kayanYildizState?.animationSpeed?.toString().padStart(2, '0') || "01"}
        waitTime={kayanYildizState?.waitingTime?.toString().padStart(2, '0') || "01"}
        direction={kayanYildizState?.direction === 'right' ? "1" : "0"}
        onStateChange={handlePowerChange}
        sendImmediately={true}
      />
    ),
    [bleManager, connectedDevice, kayanYildizState, handlePowerChange, moduleCount],
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#080808'}}>
      <View style={{gap: 5}}>
        {animationModComponent}
        {speedComponent}
        {directionComponent}
      </View>
      {footerComponent}
    </SafeAreaView>
  );
});

export default KayanYildiz;
