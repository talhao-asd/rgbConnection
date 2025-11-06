import {SafeAreaView, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, memo, useCallback, useMemo, useRef} from 'react';
import Header from '../components/Header';
import KayanYildiz from '../components/Main/KayanYildiz';
import Yildiz from '../components/Main/Yildiz';
import Mod from '../components/Main/Mod';
import Rgb from '../components/Main/Rgb';
import {useDispatch, useSelector} from 'react-redux';
import {setModuleType, setModuleCount, setActiveComponent} from '../redux/slices/moduleSlice';
import {setDeviceInfo} from '../redux/slices/deviceSlice';

// Memoized component for the "no module selected" state
const NoModuleView = memo(({onModuleSelect}) => (
  <View style={styles.noModuleContainer}>
    <Text style={styles.noModuleText}>
      Lütfen bir modül seçin
    </Text>
    <TouchableOpacity 
      style={styles.selectModuleButton}
      onPress={onModuleSelect}
    >
      <Text style={styles.selectModuleButtonText}>
        MODÜL SEÇ
      </Text>
    </TouchableOpacity>
  </View>
));

// Memoized main components
const MemoizedRgb = memo(Rgb);
const MemoizedMod = memo(Mod);
const MemoizedYildiz = memo(Yildiz);
const MemoizedKayanYildiz = memo(KayanYildiz);

const HomeScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  
  // Get state from Redux store
  const {moduleType, moduleCount, activeComponent} = useSelector(state => state.module);
  const {deviceId, deviceName, bleDevice} = useSelector(state => state.device);

  // Keep track of previous active component to prevent unnecessary re-renders
  const prevActiveComponentRef = useRef(null);

  useEffect(() => {
    // Log component changes to help with debugging
    if (prevActiveComponentRef.current !== activeComponent) {
      console.log(`Active component changed from ${prevActiveComponentRef.current} to ${activeComponent}`);
      prevActiveComponentRef.current = activeComponent;
    }
  }, [activeComponent]);

  useEffect(() => {
    // Get the module type, count, and device info from navigation params
    const {
      moduleType: navModuleType, 
      moduleCount: navModuleCount,
      deviceId: navDeviceId,
      deviceName: navDeviceName
    } = route.params || {};
    
    if (navModuleType) {
      dispatch(setModuleType(navModuleType));
    }
    
    if (navModuleCount) {
      dispatch(setModuleCount(navModuleCount));
    }

    if (navDeviceId || navDeviceName) {
      dispatch(setDeviceInfo({
        id: navDeviceId || '',
        name: navDeviceName || ''
      }));
    }
  }, [route.params, dispatch]);

  // Navigate to settings screen to select a module
  const handleModuleSelect = useCallback(() => {
    navigation.navigate('Settings', {
      selectedDevice: { 
        id: deviceId, 
        name: deviceName || 'Bağlı Cihaz' 
      }
    });
  }, [navigation, deviceId, deviceName]);

  // Render the appropriate component based on the active component
  const activeComponentElement = useMemo(() => {
    // If no module type is selected, show a message to select a module
    if (!moduleType) {
      return <NoModuleView onModuleSelect={handleModuleSelect} />;
    }
    
    switch (activeComponent) {
      case 'RGB':
        return <MemoizedRgb />;
      case 'Mod':
        return <MemoizedMod />;
      case 'Yıldız':
        return <MemoizedYildiz moduleCount={moduleCount} />;
      case 'Kayan Yıldız':
        return <MemoizedKayanYildiz moduleCount={moduleCount} />;
      default:
        // Default fallback based on module type
        if (moduleType === 'rgb') {
          return <MemoizedRgb />;
        } else if (moduleType === 'yildiz') {
          return <MemoizedYildiz moduleCount={moduleCount} />;
        } else if (moduleType === 'double') {
          return <MemoizedRgb />;
        }
        return null;
    }
  }, [moduleType, activeComponent, moduleCount, handleModuleSelect]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#080808'}}>
      <Header navigation={navigation} />
      {activeComponentElement}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  noModuleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noModuleText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'AlbertSans-Regular',
    marginBottom: 20,
    textAlign: 'center',
  },
  selectModuleButton: {
    backgroundColor: '#289E70',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  selectModuleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'AlbertSans-Bold',
  },
});

export default memo(HomeScreen);
