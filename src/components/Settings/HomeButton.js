import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Feather'
const HomeButton = () => {
  return (
    <View style={{position: 'absolute', bottom: 0, width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 10}}>
      <TouchableOpacity>
        <Icon name="power" size={48} color="#289E70" />
      </TouchableOpacity>
    </View>
  )
}

export default HomeButton;