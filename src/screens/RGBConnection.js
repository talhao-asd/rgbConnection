import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import BLEService from '../services/BLEService';
import { useNavigation } from '@react-navigation/native';

const RGBConnection = () => {
  const navigation = useNavigation();
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  
  // Use useRef to store the BLEService instance
  const bleServiceRef = useRef(null);

  useEffect(() => {
    // Initialize BLE when component mounts
    const initBLE = async () => {
      bleServiceRef.current = new BLEService();
      await bleServiceRef.current.initializeBLE();
    };
    initBLE();

    // Cleanup when component unmounts
    return () => {
      // Any cleanup needed for BLEService
      if (isConnected && connectedDevice && bleServiceRef.current) {
        bleServiceRef.current.disconnectDevice(connectedDevice.id).catch(err => {
          console.error('Disconnect error on unmount:', err);
        });
      }
    };
  }, []);

  const startScan = async () => {
    if (isScanning) return;
    
    setIsScanning(true);
    try {
      const foundDevices = await bleServiceRef.current.scanDevices();
      setDevices(foundDevices);
    } catch (error) {
      console.error('Scan error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (deviceId) => {
    try {
      await bleServiceRef.current.connectToDevice(deviceId);
      setIsConnected(true);
      const device = devices.find(d => d.id === deviceId);
      setConnectedDevice(device);
      
      // Navigate to the device control screen
      navigation.navigate('DeviceControl', { deviceId });
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const disconnect = async () => {
    if (!isConnected || !connectedDevice) return;
    
    try {
      await bleServiceRef.current.disconnectDevice(connectedDevice.id);
      setIsConnected(false);
      setConnectedDevice(null);
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const renderDevice = ({ item }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => connectToDevice(item.id)}
    >
      <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
      <Text style={styles.deviceId}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RGB Connection</Text>
      
      {isConnected ? (
        <View style={styles.connectedContainer}>
          <Text style={styles.connectedText}>
            Connected to: {connectedDevice?.name || 'Unknown Device'}
          </Text>
          <TouchableOpacity style={styles.button} onPress={disconnect}>
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.scanContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={startScan}
            disabled={isScanning}
          >
            <Text style={styles.buttonText}>
              {isScanning ? 'Scanning...' : 'Scan for Devices'}
            </Text>
          </TouchableOpacity>
          
          {devices.length > 0 ? (
            <FlatList
              data={devices}
              renderItem={renderDevice}
              keyExtractor={item => item.id}
              style={styles.deviceList}
            />
          ) : (
            <Text style={styles.noDevicesText}>
              {isScanning ? 'Searching...' : 'No devices found'}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  scanContainer: {
    flex: 1,
  },
  button: {
    backgroundColor: '#CAEF46',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  deviceList: {
    flex: 1,
  },
  deviceItem: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  deviceName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceId: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  noDevicesText: {
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 20,
  },
  connectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectedText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default RGBConnection;