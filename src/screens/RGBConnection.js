import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import BLEService from '../services/BLEService';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setDeviceInfo, setConnectionStatus, setBleDevice } from '../redux/slices/deviceSlice';

const RGBConnection = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
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
    setDevices([]); // Clear previous devices
    
    try {
      const foundDevices = await bleServiceRef.current.scanDevices();
      // Sort devices by signal strength (RSSI)
      const sortedDevices = [...foundDevices].sort((a, b) => (b.rssi || -100) - (a.rssi || -100));
      setDevices(sortedDevices);
    } catch (error) {
      console.error('Scan error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (deviceId) => {
    try {
      // Connect to the device
      const success = await bleServiceRef.current.connectToDevice(deviceId);
      if (success) {
        setIsConnected(true);
        const device = devices.find(d => d.id === deviceId);
        setConnectedDevice(device);
        
        // Store device info in Redux
        dispatch(setDeviceInfo({
          id: deviceId,
          name: device?.name || 'Unknown Device'
        }));
        dispatch(setConnectionStatus(true));
        
        // Store the actual connected device object in Redux
        const bleDevice = bleServiceRef.current.connectedDevices.get(deviceId);
        if (bleDevice) {
          dispatch(setBleDevice(bleDevice));
          console.log('Stored BLE device in Redux:', deviceId);
        }
        
        // Navigate directly to Settings screen for module selection
        navigation.navigate('Settings', {
          selectedDevice: {
            id: deviceId,
            name: device?.name || 'Unknown Device'
          }
        });
      }
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
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
        <Text style={styles.deviceId}>{item.id}</Text>
      </View>
      <View style={styles.signalStrength}>
        <Text style={styles.rssiValue}>{item.rssi || 'N/A'}</Text>
        <Text style={styles.rssiLabel}>RSSI</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RGB Connection</Text>
      
      <View style={styles.scanContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={startScan}
          disabled={isScanning}
        >
          {isScanning ? (
            <View style={styles.scanningContainer}>
              <ActivityIndicator color="#000000" />
              <Text style={styles.buttonText}>Scanning...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Scan for Devices</Text>
          )}
        </TouchableOpacity>
        
        {devices.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Available Devices</Text>
            <FlatList
              data={devices}
              renderItem={renderDevice}
              keyExtractor={item => item.id}
              style={styles.deviceList}
            />
          </>
        ) : (
          <Text style={styles.noDevicesText}>
            {isScanning ? 'Searching...' : 'No devices found. Tap Scan to search for devices.'}
          </Text>
        )}
      </View>
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
  scanningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  deviceList: {
    flex: 1,
  },
  deviceItem: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceInfo: {
    flex: 1,
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
  signalStrength: {
    alignItems: 'center',
  },
  rssiValue: {
    color: '#CAEF46',
    fontWeight: 'bold',
  },
  rssiLabel: {
    color: '#AAAAAA',
    fontSize: 10,
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