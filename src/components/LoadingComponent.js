import { View, Text, Image, ActivityIndicator } from 'react-native'
import React from 'react'

const LoadingComponent = () => {
  return (
    <View style={{backgroundColor: '#040404', flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100}}>
    <Image  source={require('../assets/images/logo.png')} style={{ resizeMode: 'contain', width: 300, height: 300, marginBottom: -100}} />
    <View style={{marginTop: 100}}>
      <Text style={{color: '#AEAEAE', fontSize: 18, width: 250, textAlign: 'center', marginBottom: 18}}>Sizin için her şeyi hazır hale getiriyoruz...</Text>
      <ActivityIndicator />
    </View>
    <View style={{
        position: 'absolute',
        bottom: 30,
        alignItems: 'center',
        width: '100%'
    }}>
        <Text style={{color: '#289E70', fontWeight: 'bold', letterSpacing: 0.75}}>STARFIBEROPTIK</Text>
        <Text style={{color: '#A6A6A6'}}>version 1.0.0</Text>
    </View>
    </View>
  )
}

export default LoadingComponent