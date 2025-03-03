import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { setAnimationMode } from '../../redux/slices/yildizSlice';

const AnimationMode = ({ moduleCount }) => {
  const dispatch = useDispatch();
  const { animationMode } = useSelector(state => state.yildiz);
  
  const handleOtomatikPress = () => {
    dispatch(setAnimationMode(7)); // Set animationMode to -1 for "OTOMATIK"
  };
  
  const handleModePress = (index) => {
    dispatch(setAnimationMode(index));
  };
  
  return (
    <View>
      <View style={{gap: 5, padding: 10}}>
        <Text
          style={{
            color: '#ffffff',
            fontSize: 16,
            fontFamily: 'AlbertSans-Regular',
            marginLeft: 60,
          }}>
          Animasyon Modu
        </Text>
        <TouchableOpacity
          style={{
            borderRadius: 10,
            width: 295,
            alignSelf: 'center',
          }}
          onPress={handleOtomatikPress}
        >
          {animationMode === 7 ? (
            <LinearGradient
              colors={['#caef46', '#289E70']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{
                padding: 10,
                borderRadius: 50,
                width: 300,
              }}>
              <Text
                style={{
                  color: '#000000',
                  fontSize: 16,
                  fontFamily: 'AlbertSans-Medium',
                  textAlign: 'center',
                }}>
                OTOMATIK
              </Text>
            </LinearGradient>
          ) : (
            <View style={{
              padding: 10,
              borderRadius: 50,
              width: 300,
              backgroundColor: '#ffffff',
            }}>
              <Text
                style={{
                  color: '#000000',
                  fontSize: 16,
                  fontFamily: 'AlbertSans-Medium',
                  textAlign: 'center',
                }}>
                OTOMATIK
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View
        style={{
          alignItems: 'center',
          width: '100%',
          marginTop: 5,
        }}>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 5 }}>
          {[1, 2].map(index => (
            <TouchableOpacity
              key={index}
              onPress={() => handleModePress(index)}
              style={{
                width: 142.5,
                height: 55,
                backgroundColor:
                  animationMode === index ? '#289E70' : '#ffffff',
                borderRadius: 16,
              }}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 5 }}>
          {[3,4].map(index => (
            <TouchableOpacity
              key={index}
              onPress={() => handleModePress(index)}
              style={{
                width: 142.5,
                height: 55,
                backgroundColor:
                  animationMode === index ? '#289E70' : '#ffffff',
                borderRadius: 16,
              }}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 5 }}>
          {[5,6].map(index => (
            <TouchableOpacity
              key={index}
              onPress={() => handleModePress(index)}
              style={{
                width: 142.5,
                height: 55,
                backgroundColor:
                  animationMode === index ? '#289E70' : '#ffffff',
                borderRadius: 16,
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default AnimationMode;
