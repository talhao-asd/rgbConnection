import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';

const ModuleSelection = ({onModuleSelect}) => {
  return (
    <View style={{width: '70%', alignItems: 'center', marginTop: 50}}>
      <Text
        style={{
          color: '#AEAEAE',
          fontSize: 16,
          fontFamily: 'AlbertSans-Regular',
        }}>
        Uygulamayı kullanmak için lütfen cihazın özelliklerini tanımlayın.
      </Text>
      <View
        style={{
          marginTop: 20,
          backgroundColor: '#000000',
          padding: 10,
          borderRadius: 10,
        }}>
        <View style={{flexDirection: 'row', gap: 10, width: 260}}>
          <TouchableOpacity
            onPress={() => onModuleSelect('rgb')}
            style={{
              backgroundColor: '#caef46',
              padding: 10,
              borderRadius: 10,
              width: 125,
            }}>
            <Text
              style={{
                color: '#000000',
                fontSize: 12,
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
              padding: 10,
              borderRadius: 10,
              width: 125,
            }}>
            <Text
              style={{
                color: '#000000',
                fontSize: 12,
                fontFamily: 'AlbertSans-Bold',
                textAlign: 'center',
              }}>
              YILDIZ
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 10}}>
          <TouchableOpacity
            onPress={() => onModuleSelect('double')}
            style={{
              backgroundColor: '#caef46',
              padding: 10,
              borderRadius: 10,
              width: 260,
            }}>
            <Text
              style={{
                color: '#000000',
                fontSize: 12,
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
