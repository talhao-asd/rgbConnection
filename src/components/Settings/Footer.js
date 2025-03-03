import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Entypo'

const Footer = ({ navigation, selectedModuleType, selectedModuleCount, deviceId, deviceName }) => {
  const handleHomePress = () => {
    // Navigate to HomeScreen with the selected module type, count, and device info
    navigation.navigate('Home', {
      moduleType: selectedModuleType,
      moduleCount: selectedModuleCount,
      deviceId: deviceId,
      deviceName: deviceName
    });
  };

  return (
    <View style={{
      position: 'absolute',
      bottom: 85,
      alignItems: 'center',
      width: '100%'
    }}>
      <TouchableOpacity onPress={handleHomePress}>
        <Icon name="home" size={48} color="#289E70" />
      </TouchableOpacity>
    </View>
  )
}

export default Footer