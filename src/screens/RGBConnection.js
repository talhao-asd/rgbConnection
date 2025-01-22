import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import BLEService from '../services/BLEService';
import { useNavigation } from '@react-navigation/native';

const RGBConnection = () => {
  const navigation = useNavigation();
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);

  useEffect(() => {
    // Initialize BLE when component mounts
    const initBLE = async () => {
      await BLEService.initializeBLE();
    };
    initBLE();

    // Cleanup when component unmounts
    return () => {
      if (isConnected && connectedDevice) {
        BLEService.disconnectDevice(connectedDevice.id);
      }
    };
  }, [isConnected, connectedDevice]);

  const startScan = async () => {
    try {
      setIsScanning(true);
      setDevices([]);
      const foundDevices = await BLEService.scanDevices();
      setDevices(foundDevices);
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (deviceId) => {
    try {
      const connected = await BLEService.connectToDevice(deviceId);
      if (connected) {
        setIsConnected(true);
        setConnectedDevice(devices.find(d => d.id === deviceId));
        // Navigate to DeviceControl screen after successful connection
        navigation.navigate('DeviceControl', {
          deviceId: deviceId,
          deviceName: devices.find(d => d.id === deviceId)?.name
        });
      }
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const disconnect = async () => {
    try {
      if (connectedDevice) {
        const deviceId = connectedDevice.id;
        const success = await BLEService.disconnectDevice(deviceId);
        if (success) {
          setIsConnected(false);
          setConnectedDevice(null);
          console.log('Device disconnected successfully');
        } else {
          console.log('Failed to disconnect device');
        }
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
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
      {/* Connection Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Status: {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
        {connectedDevice && (
          <Text style={styles.deviceInfo}>
            Connected to: {connectedDevice.name || connectedDevice.id}
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={isConnected ? disconnect : startScan}
          disabled={isScanning}
        >
          <Text style={styles.buttonText}>
            {isConnected ? 'Disconnect' : isScanning ? 'Scanning...' : 'Scan for Devices'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Device List */}
      {!isConnected && devices.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.listHeader}>Available Devices:</Text>
          <FlatList
            data={devices}
            renderItem={renderDevice}
            keyExtractor={item => item.id}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deviceInfo: {
    fontSize: 16,
    marginTop: 5,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deviceItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceId: {
    fontSize: 14,
    color: '#666',
  },
});

export default RGBConnection;