import { View, Text, Image, TouchableOpacity, Modal, FlatList, ActivityIndicator, Alert, Dimensions } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Footer from '../components/SettingsFooter'
import BLEService from '../services/BLEService'
import { useDispatch } from 'react-redux'
import { setDeviceInfo, setConnectionStatus, setBleDevice } from '../redux/slices/deviceSlice'

const WelcomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [showDevices, setShowDevices] = useState(false);
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [showPermissionError, setShowPermissionError] = useState(false);
  
  // Use useRef to store the BLEService instance
  const bleServiceRef = useRef(null);
  
  // Get screen dimensions
  const { width, height } = Dimensions.get('window');
  
  // Initialize BLEService once when component mounts
  useEffect(() => {
    bleServiceRef.current = new BLEService();
    checkPermissions();
    
    // Clean up when component unmounts
    return () => {
      // Any cleanup needed for BLEService
    };
  }, []);
  
  const checkPermissions = async () => {
    try {
      if (bleServiceRef.current) {
        const permissionsResult = await bleServiceRef.current.requestPermissions();
        setPermissionsGranted(permissionsResult);
        setShowPermissionError(!permissionsResult);
      }
    } catch (error) {
      console.error('Permission error:', error);
      setShowPermissionError(true);
    }
  };
  
  const handleScanDevices = async () => {
    // If permissions are not granted, show error and return
    if (!permissionsGranted) {
      setShowPermissionError(true);
      return;
    }
    
    setScanning(true);
    setShowDevices(true);
    
    try {
      if (bleServiceRef.current) {
        await bleServiceRef.current.initializeBLE();
        const foundDevices = await bleServiceRef.current.scanDevices();
        setDevices(foundDevices);
      }
    } catch (error) {
      console.error('Scan error:', error);
      Alert.alert('Hata', 'Cihazlar taranırken bir hata oluştu.');
    } finally {
      setScanning(false);
    }
  };
  
  const handleDeviceSelect = async (device) => {
    try {
      const success = await bleServiceRef.current.connectToDevice(device.id);
      if (success) {
        // Store device information in Redux
        dispatch(setDeviceInfo({
          id: device.id,
          name: device.name || 'Unknown Device'
        }));
        dispatch(setConnectionStatus(true));
        
        // Store the actual BLE device object
        const bleDevice = bleServiceRef.current.connectedDevices.get(device.id);
        if (bleDevice) {
          dispatch(setBleDevice(bleDevice));
        }
        
        // Hide device selection modal
        setShowDevices(false);
        
        // Navigate directly to Settings screen for module selection
        navigation.navigate('Settings', {
          selectedDevice: {
            id: device.id,
            name: device.name || 'Unknown Device'
          }
        });
      } else {
        Alert.alert('Connection Error', 'Failed to connect to device.');
      }
    } catch (error) {
      console.error('Error connecting to device:', error);
      Alert.alert('Connection Error', 'An error occurred while connecting to the device.');
    }
  };
  
  const renderDeviceItem = ({ item }) => (
    <TouchableOpacity
      style={{
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
      onPress={() => handleDeviceSelect(item)}
    >
      <View>
        <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'AlbertSans-Bold' }}>{item.name}</Text>
        <Text style={{ color: '#AEAEAE', fontSize: 12, fontFamily: 'AlbertSans-Regular' }}>{item.id}</Text>
      </View>
      <Text style={{ color: '#CAEF46', fontSize: 12 }}>RSSI: {item.rssi}</Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={{backgroundColor: '#040404', flex: 1, alignItems: 'center', paddingBottom: 100}}>
      <Image source={require('../assets/images/fiberoptic-cable.png')} style={{ resizeMode: 'contain', marginBottom: -150}} />
      <View style={{marginTop: 100, alignItems: 'center'}}>
        <Text style={{
          color: '#ffffff', 
          fontSize: width * 0.10, // Responsive font size based on screen width
          textAlign: 'center', 
          marginBottom: 18, 
          fontFamily: 'AlbertSans-Bold'
        }}>HOŞGELDİNİZ</Text>
        <Text style={{
          color: '#AEAEAE', 
          fontSize: width * 0.045, // Responsive font size for subtitle
          width: width * 0.7, // Responsive width
          textAlign: 'center', 
          marginBottom: 18,
          fontFamily: 'AlbertSans-Regular'
        }}>Başlamak için lütfen cihazınızı bağlayınız.</Text>
        <TouchableOpacity 
          style={{
            backgroundColor: '#CAEF46',
            padding: 10,
            borderRadius: 10,
            width: 200,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: 5
          }}
          onPress={handleScanDevices}
        >
          <Text style={{
            color: '#000000',
            fontFamily: 'AlbertSans-Bold',
            fontSize: 12,
          }}>BAĞLAN</Text>
        </TouchableOpacity>
      </View>
      
      {showPermissionError && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20,
          backgroundColor: '#27272c',
          padding: 12,
          borderRadius: 15,
          width: '75%',
          gap: 8
        }}>
          <Icon 
            name='error'
            size={24} 
            color='#FF3B30' 
            style={{marginLeft: 20}}
          />
          <Text style={{
            fontSize: 11,
            color: '#FF3B30',
            flex: 1,
            textAlign: 'left',
            fontWeight: 'bold',
            marginLeft: 20
          }}>
            UYGULAMAYA DEVAM ETMEK İÇİN GEREKLİ İZİNLERİ VERMELİSİNİZ.
          </Text>
        </View>
      )}
      
      <Modal
        visible={showDevices}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDevices(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.9)',
          justifyContent: 'center',
          padding: 20
        }}>
          <View style={{
            backgroundColor: '#1A1A1A',
            borderRadius: 15,
            padding: 20,
            maxHeight: '80%'
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <Text style={{
                color: '#FFFFFF',
                fontSize: 18,
                fontFamily: 'AlbertSans-Bold'
              }}>Bluetooth Cihazları</Text>
              <TouchableOpacity onPress={() => setShowDevices(false)}>
                <Icon name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {scanning ? (
              <View style={{ alignItems: 'center', padding: 20 }}>
                <ActivityIndicator size="large" color="#CAEF46" />
                <Text style={{ color: '#FFFFFF', marginTop: 10 }}>Cihazlar taranıyor...</Text>
              </View>
            ) : devices.length > 0 ? (
              <FlatList
                data={devices}
                renderItem={renderDeviceItem}
                keyExtractor={item => item.id}
                style={{ maxHeight: '80%' }}
              />
            ) : (
              <View style={{ alignItems: 'center', padding: 20 }}>
                <Text style={{ color: '#FFFFFF' }}>Cihaz bulunamadı.</Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#CAEF46',
                    padding: 10,
                    borderRadius: 10,
                    marginTop: 20
                  }}
                  onPress={handleScanDevices}
                >
                  <Text style={{ color: '#000000', fontFamily: 'AlbertSans-Bold' }}>TEKRAR TARA</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
      
      <Footer />
    </View>
  )
}

export default WelcomeScreen;