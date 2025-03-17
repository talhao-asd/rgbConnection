import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import React, {useState} from 'react';

const ModuleSelection = ({onModuleSelect}) => {
  const {width} = Dimensions.get('window');
  
  return (
    <View style={{width: '70%', alignItems: 'center', marginTop: width * 0.05}}>
      <Text
        style={{
          color: '#AEAEAE',
          fontSize: width * 0.039,
          fontFamily: 'AlbertSans-Regular',
        }}>
        Uygulamayı kullanmak için lütfen cihazın özelliklerini tanımlayın.
      </Text>
      <View
        style={{
          marginTop: width * 0.05,
          backgroundColor: '#000000',
          padding: width * 0.025,
          borderRadius: 10,
        }}>
        <View style={{flexDirection: 'row', gap: width * 0.025, width: width * 0.65}}>
          <TouchableOpacity
            onPress={() => onModuleSelect('rgb')}
            style={{
              backgroundColor: '#caef46',
              padding: width * 0.025,
              borderRadius: 10,
              width: width * 0.31,
            }}>
            <Text
              style={{
                color: '#000000',
                fontSize: width * 0.03,
                fontFamily: 'AlbertSans-Bold',
                textAlign: 'center',
              }}>
              RGB
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onModuleSelect('yildiz')}
            style={{
              backgroundColor: '#caef46',
              padding: width * 0.025,
              borderRadius: 10,
              width: width * 0.31,
            }}>
            <Text
              style={{
                color: '#000000',
                fontSize: width * 0.03,
                fontFamily: 'AlbertSans-Bold',
                textAlign: 'center',
              }}>
              YILDIZ
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: width * 0.025}}>
          <TouchableOpacity
            onPress={() => onModuleSelect('double')}
            style={{
              backgroundColor: '#caef46',
              padding: width * 0.025,
              borderRadius: 10,
              width: width * 0.65,
            }}>
            <Text
              style={{
                color: '#000000',
                fontSize: width * 0.03,
                fontFamily: 'AlbertSans-Bold',
                textAlign: 'center',
              }}>
              RGB & YILDIZ
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ModuleSelection;
