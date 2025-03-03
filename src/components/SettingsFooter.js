import { View, Text } from 'react-native'
import React from 'react'

const SettingsFooter = () => {
  return (
    <View style={{
        position: 'absolute',
        bottom: 30,
        alignItems: 'center',
        width: '100%'
    }}>
        <Text style={{
          color: '#289E70', 
          fontWeight: 'bold', 
          letterSpacing: 0.75,
          fontFamily: 'AlbertSans-Bold'
        }}>STARFIBEROPTIK</Text>
        <Text style={{
          color: '#A6A6A6',
          fontFamily: 'AlbertSans-Regular'
        }}>version 1.0.0</Text>
    </View>
  )
}

export default SettingsFooter