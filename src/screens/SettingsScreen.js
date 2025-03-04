import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6'; // veya başka bir ikon seti
import ModuleSelection from '../components/Settings/ModuleSelection';
import YildizModule from '../components/Settings/YildizModule';
import DoubleModule from '../components/Settings/DoubleModule';
import SettingsFooter from '../components/SettingsFooter';
import RgbModule from '../components/Settings/RgbModule';
import Footer from '../components/Settings/Footer';
import BLEService from '../services/BLEService';
import {useDispatch, useSelector} from 'react-redux';
import {setModuleType, setModuleCount} from '../redux/slices/moduleSlice';
import {
  setDeviceInfo,
  setConnectionStatus,
  setConnectingStatus,
  setConnectionError,
} from '../redux/slices/deviceSlice';

const SettingsScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  
  // Get state from Redux store
  const {moduleType: selectedModule, moduleCount: selectedModuleCount} = useSelector(state => state.module);
  const {deviceId, deviceName, isConnected, isConnecting, connectionError} = useSelector(state => state.device);
  
  // Local state for connected device (will be moved to Redux)
  const [connectedDevice, setConnectedDevice] = useState(null);
  
  // Use useRef to store the BLEService instance
  const bleServiceRef = useRef(null);
  
  // Initialize BLEService once when component mounts
  useEffect(() => {
    bleServiceRef.current = new BLEService();
    
    // Get the selected device from navigation params
    const { selectedDevice, preSelectedModule } = route.params || {};
    
    if (selectedDevice) {
      connectToDevice(selectedDevice);
    }
    
    // Pre-select module if provided in navigation params
    if (preSelectedModule) {
      dispatch(setModuleType(preSelectedModule));
    }
    
    // Clean up when component unmounts
    return () => {
      // Disconnect device if connected
      if (connectedDevice && bleServiceRef.current) {
        bleServiceRef.current.disconnectDevice(connectedDevice.id).catch(err => {
          console.error('Disconnect error on unmount:', err);
        });
      }
    };
  }, [route.params, dispatch]);
  
  const connectToDevice = async (device) => {
    dispatch(setConnectingStatus(true));
    
    try {
      if (bleServiceRef.current) {
        await bleServiceRef.current.connectToDevice(device.id);
        setConnectedDevice(device);
        dispatch(setDeviceInfo({
          id: device.id,
          name: device.name
        }));
        dispatch(setConnectionStatus(true));
      }
    } catch (error) {
      console.error('Connection error:', error);
      dispatch(setConnectionError('Cihaza bağlanırken bir hata oluştu.'));
      Alert.alert('Bağlantı Hatası', 'Cihaza bağlanırken bir hata oluştu.');
      // Navigate back to welcome screen if connection fails
      navigation.navigate('Welcome');
    } finally {
      dispatch(setConnectingStatus(false));
    }
  };
  
  const disconnectDevice = async () => {
    if (connectedDevice && bleServiceRef.current) {
      try {
        await bleServiceRef.current.disconnectDevice(connectedDevice.id);
        dispatch(setConnectionStatus(false));
        // Navigate back to welcome screen
        navigation.navigate('Welcome');
      } catch (error) {
        console.error('Disconnect error:', error);
        Alert.alert('Bağlantı Kesme Hatası', 'Cihaz bağlantısı kesilirken bir hata oluştu.');
      }
    }
  };

  const handleModuleSelect = (moduleType) => {
    dispatch(setModuleType(moduleType));
    // Reset module count when changing module type
    dispatch(setModuleCount(1));
  };

  const handleModuleCountSelect = (count) => {
    dispatch(setModuleCount(count));
  };

  const renderSelectedModule = () => {
    switch (selectedModule) {
      case 'rgb':
        return <RgbModule 
          onBack={() => dispatch(setModuleType(null))} 
          deviceId={connectedDevice?.id} 
        />;
      case 'yildiz':
        return <YildizModule 
          onBack={() => dispatch(setModuleType(null))} 
          deviceId={connectedDevice?.id} 
          onModuleCountSelect={handleModuleCountSelect}
          selectedModuleCount={selectedModuleCount}
        />;
      case 'double':
        return <DoubleModule 
          onBack={() => dispatch(setModuleType(null))} 
          deviceId={connectedDevice?.id} 
          onModuleCountSelect={handleModuleCountSelect}
          selectedModuleCount={selectedModuleCount}
        />;
      default:
        return <ModuleSelection onModuleSelect={handleModuleSelect} />;
    }
  };

  // Determine if we should show the Footer (home button)
  // Only show it when a module is selected
  const shouldShowFooter = selectedModule !== null;

  // For RGB module, we don't need to select a module count
  // For YILDIZ and DOUBLE modules, we need to select a module count
  const isReadyToNavigate = selectedModule === 'rgb' || selectedModuleCount > 0;

  return (
    <View
      style={{
        backgroundColor: '#080808',
        flex: 1,
        alignItems: 'center',
        paddingBottom: 100,
      }}>
      <View
        style={{
          position: 'absolute',
          top: 10,
          right: -170,
          width: '100%',
          height: 50,
          backgroundColor: '#000000',
          alignItems: 'center',
          paddingRight: 10,
          gap: 10,
        }}>
        <Icon name="language" size={32} color="#D7D7D8" />
        <Text
          style={{
            color: '#D7D7D8',
            fontSize: 12,
            fontFamily: 'AlbertSans-Regular',
          }}>
          TR
        </Text>
      </View>
      <Image
        source={require('../assets/images/fiberoptic-cable.png')}
        style={{resizeMode: 'contain', marginBottom: -150, marginTop: -50}}
      />
      <View style={{marginTop: 100, alignItems: 'center'}}>
        <Text
          style={{
            color: '#ffffff',
            fontSize: 32,
            textAlign: 'center',
            marginBottom: 18,
            fontFamily: 'AlbertSans-Bold',
          }}>
          {connectedDevice ? connectedDevice.name : 'Bağlanıyor...'}
        </Text>
        <Text
          style={{
            color: '#AEAEAE',
            fontSize: 14,
            textAlign: 'center',
            marginBottom: 18,
            fontFamily: 'AlbertSans-Regular',
          }}>
          {connectedDevice ? connectedDevice.id : ''}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#CAEF46',
            padding: 10,
            borderRadius: 10,
            width: 200,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: 5,
          }}
          onPress={disconnectDevice}
          disabled={isConnecting || !connectedDevice}
        >
          <Text
            style={{
              color: '#000000',
              fontFamily: 'AlbertSans-Bold',
              fontSize: 12,
            }}>
            BAĞLANTIYI KES
          </Text>
        </TouchableOpacity>
      </View>
      {renderSelectedModule()}
      {shouldShowFooter && isReadyToNavigate && (
        <Footer 
          navigation={navigation} 
          selectedModuleType={selectedModule} 
          selectedModuleCount={selectedModuleCount} 
          deviceId={connectedDevice?.id}
          deviceName={connectedDevice?.name}
        />
      )}
      <SettingsFooter />
    </View>
  );
};

export default SettingsScreen;
