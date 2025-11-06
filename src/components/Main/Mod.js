import { View, SafeAreaView } from 'react-native'
import React, { memo, useMemo, useState, useCallback, useEffect, useRef } from 'react'
import AnimationList from '../Mod/AnimationList'
import Speed from '../Mod/Speed'
import Footer from '../Footer'
import { useSelector, useDispatch } from 'react-redux'
import base64 from 'react-native-base64'
import BLEService from '../../services/BLEService'

const SERVICE_UUID = '00000180-0000-1000-8000-00805f9b34fb'
const CHARACTERISTIC_UUID = '0000dead-0000-1000-8000-00805f9b34fb'

const Mod = memo(() => {
  const [isPowerOn, setIsPowerOn] = useState(false)
  const [connectedDevice, setConnectedDevice] = useState(null)
  const [isReconnecting, setIsReconnecting] = useState(false)
  
  // Access BLEService for potential reconnection
  const bleServiceRef = useRef(null)
  
  // Use more specific selectors to prevent unnecessary re-renders
  const modState = useSelector(state => state.mod)
  const { bleDevice, deviceId, isConnected } = useSelector(state => state.device)
  const dispatch = useDispatch()
  
  // Initialize BLEService if needed
  useEffect(() => {
    bleServiceRef.current = new BLEService()
  }, [])
  
  // Set the connected device from Redux
  useEffect(() => {
    if (bleDevice) {
      console.log('Mod component received device from Redux:', deviceId)
      setConnectedDevice(bleDevice)
    }
  }, [bleDevice, deviceId])
  
  // Handle reconnection attempts if device disconnects
  const attemptReconnect = useCallback(async () => {
    if (!deviceId || isReconnecting) return
    
    try {
      setIsReconnecting(true)
      console.log('Mod component attempting to reconnect to device:', deviceId)
      
      if (bleServiceRef.current) {
        const success = await bleServiceRef.current.connectToDevice(deviceId)
        if (success) {
          // Update the connected device
          const reconnectedDevice = bleServiceRef.current.connectedDevices.get(deviceId)
          if (reconnectedDevice) {
            setConnectedDevice(reconnectedDevice)
            console.log('Mod successfully reconnected to device:', deviceId)
          }
        } else {
          console.log('Mod failed to reconnect to device')
        }
      }
    } catch (error) {
      console.error('Error during reconnection attempt:', error)
    } finally {
      setIsReconnecting(false)
    }
  }, [deviceId, isReconnecting])
  
  // If device is null but we have a deviceId, try to reconnect
  useEffect(() => {
    if (deviceId && !connectedDevice && !isReconnecting) {
      console.log('Device connection lost, attempting to reconnect from Mod component')
      attemptReconnect()
    }
  }, [connectedDevice, deviceId, attemptReconnect, isReconnecting])
  
  // Don't disconnect when component unmounts
  useEffect(() => {
    return () => {
      // No need to disconnect, as this would break other tabs
      console.log('Mod component unmounting, preserving device connection')
    }
  }, [])
  
  // Format command based on current parameters
  const formatCommand = useCallback((isOn) => {
    // The mode letter is uppercase if ON, lowercase if OFF
    const modeChar = isOn ? 'R' : 'r'
    const { selectedAnimation, animationSpeed, lightIntensity } = modState
    
    // Format: >R000101| where:
    // R = mode (uppercase for ON, lowercase for OFF)
    // 00 = animation selection (01-24, not 00)
    // 01 = animation speed (01-10)
    // 01 = light intensity/brightness (01-99)
    
    // Format parameters as two digits, ensuring animation starts at 01 not 00
    // If selectedAnimation is 0 or undefined, use 01 as the minimum value
    const animationValue = selectedAnimation || 1
    const animationFormatted = animationValue.toString().padStart(2, '0')
    
    // Clamp animation speed to 1-10 range
    const speedValue = Math.min(Math.max(animationSpeed || 1, 1), 10)
    const speedFormatted = speedValue.toString().padStart(2, '0')
    
    const lightIntensityFormatted = lightIntensity?.toString().padStart(2, '0') || "01"
    
    return `>${modeChar}${animationFormatted}${speedFormatted}${lightIntensityFormatted}|`
  }, [modState])
  
  // Send command to device
  const sendCommand = useCallback(async () => {
    if (!isPowerOn || !connectedDevice) {
      console.log('Cannot send command: power is off or no device connected')
      return
    }
    
    try {
      const command = formatCommand(isPowerOn)
      console.log('Sending command:', command)
      
      // Convert string to base64 before sending
      const base64Command = base64.encode(command)
      
      await connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Command
      )
      
      console.log('Command sent successfully')
    } catch (error) {
      console.error('Error sending command:', error)
    }
  }, [connectedDevice, isPowerOn, formatCommand])
  
  // Handle power toggle from Footer
  const handlePowerToggle = useCallback(async (isOn, device) => {
    console.log(`Power toggled to: ${isOn ? 'ON' : 'OFF'}`)
    setIsPowerOn(isOn)
    
    if (device && !connectedDevice) {
      setConnectedDevice(device)
    }
    
    // If we received a device from the Footer, use it
    const deviceToUse = device || connectedDevice
    if (!deviceToUse) {
      console.log('No device available to send command')
      return
    }
    
    try {
      const command = formatCommand(isOn)
      console.log('Sending command:', command)
      
      // Convert string to base64 before sending
      const base64Command = base64.encode(command)
      
      await deviceToUse.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Command
      )
      
      console.log('Command sent successfully')
    } catch (error) {
      console.error('Error sending command:', error)
    }
  }, [connectedDevice, formatCommand])
  
  // Effect to scan for devices when component mounts
  useEffect(() => {
    // Remove the automatic scanning and connection
    // This functionality should only happen in the dedicated RGBConnection screen
    
    // Cleanup function
    // return () => {
    //   if (connectedDevice) {
    //     connectedDevice.cancelConnection()
    //   }
    // }
  }, [connectedDevice])
  
  // Effect to send command when mod state changes
  useEffect(() => {
    if (isPowerOn && connectedDevice) {
      try {
        // Send command when any of the relevant parameters change
        console.log(`Sending command from Mod using device: ${connectedDevice.id}`);
        sendCommand();
      } catch (error) {
        console.error('Error in Mod command effect:', error);
      }
    }
  }, [
    isPowerOn, 
    connectedDevice, 
    modState.selectedAnimation, 
    modState.animationSpeed, 
    modState.lightIntensity,
    sendCommand
  ]);
  
  // Memoize child components to prevent unnecessary re-renders
  const animationListComponent = useMemo(() => <AnimationList />, [])
  const speedComponent = useMemo(() => <Speed />, [])
  
  // Pass relevant props to Footer
  const footerComponent = useMemo(() => {
    // Ensure animation speed is in correct range (1-10)
    const speedValue = Math.min(Math.max(modState.animationSpeed || 1, 1), 10);
    const speedFormatted = speedValue.toString().padStart(2, '0');
    
    return (
      <Footer 
        bleManager={bleDevice}
        connectedDevice={connectedDevice}
        mode="R"
        onStateChange={handlePowerToggle}
        sendImmediately={false} // Let us handle the command sending
        animationSpeed={speedFormatted}
        brightness={modState.lightIntensity?.toString().padStart(2, '0') || "01"}
        rgbAnimation={(modState.selectedAnimation || 1).toString().padStart(2, '0')}
      />
    );
  }, [bleDevice, connectedDevice, handlePowerToggle, modState]);
  
  return (
    <View style={{flex: 1, backgroundColor: '#080808'}}>
      <View style={{gap: 0}}>
        {animationListComponent}
        {speedComponent}
      </View>
      {footerComponent}
    </View>
  )
})

export default Mod