import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { setAnimationMode } from '../../redux/slices/kayanYildizSlice';

const AnimationMod = ({ moduleCount }) => {
  const dispatch = useDispatch();
  const { animationMode } = useSelector(state => state.kayanYildiz);
  
  const handleOtomatikPress = () => {
    dispatch(setAnimationMode(-1)); // Set animationMode to -1 for "OTOMATIK"
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
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          gap: 5,
          paddingHorizontal: 10,
          width: 340,
          marginTop: 5,
        }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[0, 1, 2, 3, 4].map(index => (
            <TouchableOpacity
              key={index}
              onPress={() => handleModePress(index)}
              style={{
                width: 120,
                height: 50,
                backgroundColor:
                  animationMode === index ? '#289E70' : '#ffffff',
                borderRadius: 12,
                marginRight: index < 4 ? 10 : 0,
              }}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default AnimationMod;
