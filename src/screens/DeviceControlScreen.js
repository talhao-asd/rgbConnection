import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BLEService from '../services/BLEService';

const DeviceControlScreen = ({ route, navigation }) => {
  const { deviceId, deviceName } = route.params;
  const [onOffStatus, setOnOffStatus] = useState('0');
  const [calismaModu, setCalismaModu] = useState('K');
  const [ledSayisi, setLedSayisi] = useState('2');
  const [animasyonModu, setAnimasyonModu] = useState('1');
  const [animasyonHizDegeri, setAnimasyonHizDegeri] = useState('1');
  
  // Use useRef to store the BLEService instance
  const bleServiceRef = useRef(null);
  
  useEffect(() => {
    // Initialize BLEService
    bleServiceRef.current = new BLEService();
    
    // Check if device is still connected and has the right characteristic
    const checkConnection = async () => {
      if (bleServiceRef.current && !bleServiceRef.current.isDeviceConnected(deviceId)) {
        navigation.goBack();
      }
      
      if (bleServiceRef.current) {
        const characteristic = bleServiceRef.current.getDeviceCharacteristic(deviceId);
        console.log('Using characteristic:', characteristic?.uuid);
      }
    };
    
    checkConnection();
    
    // Clean up when component unmounts
    return () => {
      // Any cleanup needed
    };
  }, [deviceId]);

  const sendCommand = async (command) => {
    try {
      console.log('Sending command with values:', {
        onOffStatus: command[1],
        calismaModu: command[2],
        ledSayisi: command[3],
        animasyonModu: command[4],
        animasyonHizDegeri: command[5]
      });
      
      if (bleServiceRef.current) {
        await bleServiceRef.current.writeDataToDevice(deviceId, command);
      }
    } catch (error) {
      console.error('Send command error:', error);
    }
  };

  const formatCommand = (isOn, mode, leds, anim, speed) => {
    // Use lowercase mode for OFF, uppercase for ON
    const modeChar = isOn === '1' ? mode.toUpperCase() : mode.toLowerCase();
    console.log(`DeviceControlScreen formatCommand - Power: ${isOn === '1' ? 'ON' : 'OFF'}, mode: ${modeChar}`);
    // Don't include power state as separate character, just use case of mode letter
    return `>${modeChar}${leds}${anim}${speed}|`;
  };

  const togglePower = async () => {
    const newStatus = onOffStatus === '0' ? '1' : '0';
    setOnOffStatus(newStatus);
    
    const command = formatCommand(
      newStatus,
      calismaModu,
      ledSayisi,
      animasyonModu,
      animasyonHizDegeri
    );
    
    console.log(`Power button toggled: ${newStatus === '1' ? 'ON' : 'OFF'}, sending command: ${command}`);
    await sendCommand(command);
  };

  const changeMode = async (mode) => {
    setCalismaModu(mode);
    
    const command = formatCommand(
      onOffStatus,
      mode,
      ledSayisi,
      animasyonModu,
      animasyonHizDegeri
    );
    
    console.log(`Mode changed to ${mode}, power status ${onOffStatus === '1' ? 'ON' : 'OFF'}, sending command: ${command}`);
    await sendCommand(command);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Control</Text>
      <Text style={styles.deviceName}>{deviceName || deviceId}</Text>
      
      {/* Power Button */}
      <TouchableOpacity 
        style={[styles.button, onOffStatus === '1' ? styles.buttonActive : {}]} 
        onPress={togglePower}
      >
        <Text style={styles.buttonText}>
          {onOffStatus === '1' ? 'Turn Off' : 'Turn On'}
        </Text>
      </TouchableOpacity>
      
      {/* Mode Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mode</Text>
        <View style={styles.modeContainer}>
          <TouchableOpacity 
            style={[styles.modeButton, calismaModu === 'K' ? styles.modeActive : {}]}
            onPress={() => changeMode('K')}
          >
            <Text style={styles.modeText}>K</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeButton, calismaModu === 'Y' ? styles.modeActive : {}]}
            onPress={() => changeMode('Y')}
          >
            <Text style={styles.modeText}>Y</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.modeButton, calismaModu === 'M' ? styles.modeActive : {}]}
            onPress={() => changeMode('M')}
          >
            <Text style={styles.modeText}>M</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonActive: {
    backgroundColor: '#CAEF46',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modeButton: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
  },
  modeActive: {
    backgroundColor: '#CAEF46',
  },
  modeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginTop: 30,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default DeviceControlScreen;