import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { Platform, PermissionsAndroid } from 'react-native';

class BLEService {
  constructor() {
    this.bleManager = new BleManager();
    this.connectedDevices = new Map(); // Store multiple connected devices
    this.deviceCharacteristics = new Map(); // Store characteristics for each device
    this.SERVICE_UUID = "00000180-0000-1000-8000-00805f9b34fb";
    this.CHARACTERISTIC_WRITE_UUID = "0000DEAD-0000-1000-8000-00805f9b34fb";  // To ESP32
    this.CHARACTERISTIC_READ_UUID = "0000FEF4-0000-1000-8000-00805f9b34fb";   // From ESP32
  }

  async requestPermissions() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Bluetooth Permission',
          message: 'Application needs access to your location for BLE scanning',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      
      if (Platform.Version >= 31) {
        const bluetoothScan = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          {
            title: 'Bluetooth Scan Permission',
            message: 'Application needs access to bluetooth scan',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        const bluetoothConnect = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          {
            title: 'Bluetooth Connect Permission',
            message: 'Application needs access to bluetooth connect',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return (
          granted === PermissionsAndroid.RESULTS.GRANTED &&
          bluetoothScan === PermissionsAndroid.RESULTS.GRANTED &&
          bluetoothConnect === PermissionsAndroid.RESULTS.GRANTED
        );
      }
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }

  async initializeBLE() {
    const hasPermissions = await this.requestPermissions();
    if (!hasPermissions) {
      throw new Error('Bluetooth permissions not granted');
    }
  }

  async scanDevices() {
    try {
      const devices = [];
      return new Promise((resolve, reject) => {
        // Stop scanning after 5 seconds
        setTimeout(() => {
          this.bleManager.stopDeviceScan();
          resolve(devices);
        }, 5000);

        this.bleManager.startDeviceScan(
          null, // You can specify service UUIDs here if needed
          { allowDuplicates: false },
          (error, device) => {
            if (error) {
              this.bleManager.stopDeviceScan();
              reject(error);
              return;
            }

            // Only add devices with a name
            if (device.name) {
              const deviceInfo = {
                id: device.id,
                name: device.name,
                rssi: device.rssi,
              };
              
              // Avoid duplicates
              if (!devices.find(d => d.id === device.id)) {
                devices.push(deviceInfo);
              }
            }
          }
        );
      });
    } catch (error) {
      console.error('Scan error:', error);
      return [];
    }
  }

  async connectToDevice(deviceId) {
    try {
      const device = await this.bleManager.connectToDevice(deviceId);
      console.log('Connected to device:', deviceId);

      // Discover services and characteristics
      await device.discoverAllServicesAndCharacteristics();
      const services = await device.services();
      
      // Store the device and find its characteristics
      this.connectedDevices.set(deviceId, device);
      
      // Find and store all characteristics
      let deviceChars = new Map();
      for (let service of services) {
        const characteristics = await service.characteristics();
        characteristics.forEach(characteristic => {
          if (characteristic.isWritableWithResponse) {
            deviceChars.set(service.uuid, characteristic.uuid);
          }
        });
      }
      
      this.deviceCharacteristics.set(deviceId, deviceChars);
      console.log('Device characteristics:', deviceChars);
      
      return true;
    } catch (error) {
      console.error('Connection error:', error);
      return false;
    }
  }

  async writeDataToDevice(deviceId, data) {
    const device = this.connectedDevices.get(deviceId);
    if (!device) {
      throw new Error(`Device ${deviceId} not connected`);
    }

    try {
      console.log('Writing data:', data);
      // Convert string to UTF-8 encoded bytes
      const encoder = new TextEncoder();
      const dataBytes = encoder.encode(data);
      
      await device.writeCharacteristicWithResponseForService(
        this.SERVICE_UUID,
        this.CHARACTERISTIC_WRITE_UUID,
        Buffer.from(dataBytes).toString('base64')
      );
      console.log('Write successful');
      return true;
    } catch (error) {
      console.error('Write error:', error);
      return false;
    }
  }

  async disconnectDevice(deviceId) {
    const device = this.connectedDevices.get(deviceId);
    if (device) {
      try {
        await device.cancelConnection();
        this.connectedDevices.delete(deviceId);
        return true;
      } catch (error) {
        console.error('Disconnect error:', error);
        return false;
      }
    }
  }

  // Clean up method
  destroy() {
    // Disconnect all devices
    this.connectedDevices.forEach(async (device, deviceId) => {
      await this.disconnectDevice(deviceId);
    });
    this.bleManager.destroy();
  }

  isDeviceConnected(deviceId) {
    return this.connectedDevices.has(deviceId);
  }

  getConnectedDevices() {
    return Array.from(this.connectedDevices.keys());
  }

  getDeviceCharacteristic(deviceId) {
    return this.deviceCharacteristics.get(deviceId);
  }

  // Add method to start listening for notifications from ESP32
  async startNotifications(deviceId, callback) {
    const device = this.connectedDevices.get(deviceId);
    if (!device) {
      throw new Error(`Device ${deviceId} not connected`);
    }

    try {
      device.monitorCharacteristicForService(
        this.SERVICE_UUID,
        this.CHARACTERISTIC_READ_UUID,  // Using FEF4 characteristic for reading
        (error, characteristic) => {
          if (error) {
            console.error('Notification error:', error);
            return;
          }
          
          // Decode the received base64 data
          const data = Buffer.from(characteristic.value, 'base64').toString();
          callback(data);
        }
      );
      console.log('Started notifications for:', deviceId);
      return true;
    } catch (error) {
      console.error('Start notifications error:', error);
      return false;
    }
  }

  // Parse data received from device
  parseDeviceData(data) {
    // Sample format: >Y150101|
    if (!data || data.length < 7) {
      console.warn('Received invalid data format:', data);
      return null;
    }
    
    try {
      // Find the start and end markers
      const startIndex = data.indexOf('>');
      const endIndex = data.indexOf('|');
      
      if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
        console.warn('Invalid data format (missing markers):', data);
        return null;
      }
      
      // Extract the content between markers
      const content = data.substring(startIndex + 1, endIndex);
      console.log('Extracted content from device data:', content);
      
      // First character is the mode
      const mode = content.charAt(0);
      
      // Parse the remaining data based on the format
      if (content.length < 2) {
        console.warn('Data content too short:', content);
        return null;
      }
      
      // Check if the mode letter is uppercase (indicating power is ON)
      const isPowerOn = mode === mode.toUpperCase();
      console.log(`Mode character is '${mode}', power is ${isPowerOn ? 'ON' : 'OFF'}`);
      
      // Parse the rest of the data
      // Format: Y115050| -> mode(Y) + ledCount(1) + animationMode(1) + animationSpeed(50) + waitingTime(50)
      const ledCount = content.charAt(1);
      const animationMode = content.length > 2 ? content.charAt(2) : '0';
      
      // Extract animation speed and waiting time
      let animationSpeed = 50;
      let waitingTime = 50;
      
      if (content.length >= 5) {
        // Extract animation speed (2 digits)
        animationSpeed = parseInt(content.substring(3, 5), 10);
      }
      
      if (content.length >= 7) {
        // Extract waiting time (2 digits)
        waitingTime = parseInt(content.substring(5, 7), 10);
      }
      
      console.log('Parsed data values:', {
        mode,
        ledCount,
        animationMode,
        animationSpeed,
        waitingTime,
        isPowerOn
      });
      
      return {
        mode,
        ledCount,
        animationMode,
        animationSpeed,
        waitingTime,
        isPowerOn // Uppercase means power is ON
      };
    } catch (error) {
      console.error('Error parsing device data:', error);
      return null;
    }
  }
}

export default BLEService;