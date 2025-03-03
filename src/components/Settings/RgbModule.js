import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'; // veya başka bir ikon seti
import LinearGradient from 'react-native-linear-gradient';

const RgbModule = ({onBack}) => {
  return (
    <View style={{width: '60%', alignItems: 'center', marginTop: 30}}>
      <View
        style={{
          marginBottom: 40,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: '#000000',
          padding: 10,
          borderRadius: 10,
        }}>
        <TouchableOpacity style={{width: '10%'}} onPress={onBack}>
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={{width: '90%', marginLeft: 20}}>
          <LinearGradient
            colors={['#AD5389', '#FCAB7A']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={{
              padding: 10,
              borderRadius: 10,
              alignItems: 'center',
              width: '100%',
            }}>
            <Text
              style={{
                color: '#000000',
                fontSize: 12,
                textAlign: 'center',
                fontFamily: 'AlbertSans-Bold',
              }}>
              RGB
            </Text>
          </LinearGradient>
        </View>
      </View>

    </View>
  );
};

export default RgbModule;
