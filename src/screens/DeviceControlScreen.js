import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BLEService from '../services/BLEService';

const DeviceControlScreen = ({ route, navigation }) => {
  const { deviceId, deviceName } = route.params;
  const [onOffStatus, setOnOffStatus] = useState('0');
  const [calismaModu, setCalismaModu] = useState('K');
  const [ledSayisi, setLedSayisi] = useState('2');
  const [animasyonModu, setAnimasyonModu] = useState('1');
  const [animasyonHizDegeri, setAnimasyonHizDegeri] = useState('1');

  
  useEffect(() => {
    // Check if device is still connected and has the right characteristic
    if (!BLEService.isDeviceConnected(deviceId)) {
      navigation.goBack();
    }

    const characteristic = BLEService.getDeviceCharacteristic(deviceId);
    console.log('Using characteristic:', characteristic?.uuid);
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
      await BLEService.writeDataToDevice(deviceId, command);
    } catch (error) {
      console.error('Send command error:', error);
    }
  };

  const formatCommand = (status, mode, leds, anim, speed) => {
    return `>:${status}${mode}${leds}${anim}${speed}|`;
  };

  const togglePower = async () => {
    try {
      const newStatus = onOffStatus === '0' ? '1' : '0';
      setOnOffStatus(newStatus);
      
      const command = formatCommand(newStatus, calismaModu, ledSayisi, animasyonModu, animasyonHizDegeri);
      console.log('Sending power command:', command);
      await sendCommand(command);
    } catch (error) {
      console.error('Toggle power error:', error);
    }
  };

  const changeMode = async (mode) => {
    try {
      setCalismaModu(mode);
      const command = formatCommand(onOffStatus, mode, ledSayisi, animasyonModu, animasyonHizDegeri);
      console.log('Sending mode command:', command);
      await sendCommand(command);
    } catch (error) {
      console.error('Change mode error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.deviceName}>Device: {deviceName || deviceId}</Text>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: onOffStatus === '1' ? '#4CAF50' : '#f44336' }]}
        onPress={togglePower}
      >
        <Text style={styles.buttonText}>
          {onOffStatus === '1' ? 'Turn Off' : 'Turn On'}
        </Text>
      </TouchableOpacity>

      <View style={styles.modeContainer}>
        <TouchableOpacity 
          style={[styles.modeButton, calismaModu === 'K' && styles.selectedMode]}
          onPress={() => changeMode('K')}
        >
          <Text style={styles.buttonText}>Mode K</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeButton, calismaModu === 'Y' && styles.selectedMode]}
          onPress={() => changeMode('Y')}
        >
          <Text style={styles.buttonText}>Mode Y</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeButton, calismaModu === 'R' && styles.selectedMode]}
          onPress={() => changeMode('R')}
        >
          <Text style={styles.buttonText}>Mode R</Text>
        </TouchableOpacity>
      </View>

      {/* Debug information */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>Current Status: {onOffStatus}</Text>
        <Text style={styles.debugText}>Mode: {calismaModu}</Text>
        <Text style={styles.debugText}>Animation: {animasyonModu}</Text>
        <Text style={styles.debugText}>Led sayisi: {ledSayisi}</Text>
        <Text style={styles.debugText}>Animation hizi: {animasyonHizDegeri}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  deviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  modeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
  },
  selectedMode: {
    backgroundColor: '#1976D2',
    borderWidth: 2,
    borderColor: 'white',
  },
  debugContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    width: '100%',
  },
  debugText: {
    fontSize: 14,
    color: '#333',
  },
});

export default DeviceControlScreen;