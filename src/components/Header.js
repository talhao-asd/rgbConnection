import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, memo, useCallback, useMemo} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {setActiveComponent} from '../redux/slices/moduleSlice';

// Memoized tab button component
const TabButton = memo(({label, isSelected, onPress}) => {
  const tabStyle = {
    borderBottomWidth: isSelected ? 2 : 0,
    borderBottomColor: '#ffffff',
    paddingBottom: 2,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  };

  const textStyle = {
    color: isSelected ? '#ffffff' : '#a6a6a6',
    fontSize: 18,
    fontFamily: 'AlbertSans-Regular'
  };

  return (
    <TouchableOpacity onPress={onPress} style={tabStyle}>
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
});

const Header = memo(({navigation}) => {
  const dispatch = useDispatch();
  
  // Get state from Redux store
  const {moduleType, activeComponent} = useSelector(state => state.module);
  const {deviceId, deviceName} = useSelector(state => state.device);

  const handleModuleSelect = useCallback((moduleName) => {
    dispatch(setActiveComponent(moduleName));
  }, [dispatch]);

  const handleSettingsPress = useCallback(() => {
    // Navigate to settings screen with the current module type and device ID
    navigation.navigate('Settings', {
      selectedDevice: { 
        id: deviceId, 
        name: deviceName || 'Bağlı Cihaz' 
      },
      preSelectedModule: moduleType
    });
  }, [navigation, deviceId, deviceName, moduleType]);

  // Render header options based on module type
  const renderHeaderOptions = useCallback(() => {
    // If no module type is selected, don't show any options
    if (!moduleType) {
      return null;
    }
    
    if (moduleType === 'rgb') {
      return (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          gap: 40
        }}>
          <TabButton 
            label="Mod"
            isSelected={activeComponent === 'Mod'}
            onPress={() => handleModuleSelect('Mod')}
          />
          <TabButton 
            label="RGB"
            isSelected={activeComponent === 'RGB'}
            onPress={() => handleModuleSelect('RGB')}
          />
        </View>
      );
    } else if (moduleType === 'yildiz') {
      return (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          gap: 40
        }}>
          <TabButton 
            label="Kayan Yıldız"
            isSelected={activeComponent === 'Kayan Yıldız'}
            onPress={() => handleModuleSelect('Kayan Yıldız')}
          />
          <TabButton 
            label="Yıldız"
            isSelected={activeComponent === 'Yıldız'}
            onPress={() => handleModuleSelect('Yıldız')}
          />
        </View>
      );
    } else if (moduleType === 'double') {
      return (
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          width: '100%'
        }}>
          <View style={{flexDirection: 'row', gap: 40, marginBottom: 15}}>
            <TabButton 
              label="Kayan Yıldız"
              isSelected={activeComponent === 'Kayan Yıldız'}
              onPress={() => handleModuleSelect('Kayan Yıldız')}
            />
            <TabButton 
              label="Yıldız"
              isSelected={activeComponent === 'Yıldız'}
              onPress={() => handleModuleSelect('Yıldız')}
            />
          </View>
          <View style={{flexDirection: 'row', gap: 40}}>
            <TabButton 
              label="Mod"
              isSelected={activeComponent === 'Mod'}
              onPress={() => handleModuleSelect('Mod')}
            />
            <TabButton 
              label="RGB"
              isSelected={activeComponent === 'RGB'}
              onPress={() => handleModuleSelect('RGB')}
            />
          </View>
        </View>
      );
    }
    
    // Default case - should not happen
    return null;
  }, [moduleType, activeComponent, handleModuleSelect]);

  // Memoize the header options to prevent unnecessary re-renders
  const headerOptions = useMemo(() => renderHeaderOptions(), [renderHeaderOptions]);

  return (
    <View style={{padding: 24}}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'space-between'}}>
        <Text style={{color: '#ffffff', fontSize: 21, fontFamily: 'AlbertSans-Regular'}}>{deviceId || 'MAC_ADDRESS'}</Text>
        <TouchableOpacity onPress={handleSettingsPress}>
          <Icon
            name="settings-sharp"
            size={24}
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>
      <View style={{
        marginTop: 30, 
        paddingHorizontal: 10
      }}>
        {headerOptions}
      </View>
    </View>
  );
});

export default Header;
