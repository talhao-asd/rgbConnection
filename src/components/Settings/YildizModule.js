import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'; // veya başka bir ikon seti
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { setModuleCount } from '../../redux/slices/yildizSlice';

const YildizModule = ({onBack}) => {
  const dispatch = useDispatch();
  const selectedModuleCount = useSelector(state => state.yildiz.moduleCount);
  const {width} = Dimensions.get('window');
  
  const handleModuleCountSelect = (count) => {
    dispatch(setModuleCount(count));
  };

  return (
    <View style={{width: '60%', alignItems: 'center', marginTop: width * 0.07}}>
      <View
        style={{
          marginBottom: width * 0.04,
          flexDirection: 'row',
          alignItems: 'center',
          gap: width * 0.025,
          backgroundColor: '#000000',
          padding: width * 0.025,
          borderRadius: 10,
        }}>
        <TouchableOpacity style={{width: '10%'}} onPress={onBack}>
          <Icon name="arrow-back" size={width * 0.06} color="#ffffff" />
        </TouchableOpacity>
        <View style={{width: '90%', marginLeft: width * 0.05}}>
          <LinearGradient
            colors={['#1A0F32', '#4E35D7']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={{
              padding: width * 0.025,
              borderRadius: 10,
              alignItems: 'center',
              width: '100%',
            }}>
            <Text
              style={{
                color: '#ffffff',
                fontSize: width * 0.03,
                textAlign: 'center',
                fontFamily: 'AlbertSans-Bold',
              }}>
              YILDIZ
            </Text>
          </LinearGradient>
        </View>
      </View>
      <Text
        style={{
          color: '#AEAEAE',
          fontSize: width * 0.035,
          fontFamily: 'AlbertSans-Regular',
        }}>
        Yıldız modunu kullanmak için cihazın modül adedini seçiniz.
      </Text>
      <View
        style={{
          marginTop: width * 0.05,
          backgroundColor: '#000000',
          padding: width * 0.025,
          borderRadius: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            gap: width * 0.025,
            width: width * 0.65,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: '#ffffff',
              fontSize: width * 0.04,
              fontFamily: 'AlbertSans-Regular',
            }}>
            Modül Sayısı
          </Text>
          <View style={{flexDirection: 'row', gap: width * 0.025, alignItems: 'center'}}>
            <TouchableOpacity 
              style={{ width: width * 0.085 }}
              onPress={() => handleModuleCountSelect(1)}
            >
              <LinearGradient
                colors={selectedModuleCount === 1 ? ['#4E35D7', '#1A0F32'] :  ['#AEAEAE', '#AEAEAE'] }
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{
                  padding: width * 0.025,
                  borderRadius: width * 0.05,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: '#ffffff',
                }}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: width * 0.025,
                    fontFamily: 'AlbertSans-Bold',
                    textAlign: 'center',
                  }}>
                  1
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ width: width * 0.085 }}
              onPress={() => handleModuleCountSelect(2)}
            >
              <LinearGradient
                colors={selectedModuleCount === 2 ? ['#4E35D7', '#1A0F32'] :  ['#AEAEAE', '#AEAEAE'] }
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{
                  padding: width * 0.025,
                  borderRadius: width * 0.05,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: '#ffffff',
                }}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: width * 0.025,
                    fontFamily: 'AlbertSans-Bold',
                    textAlign: 'center',
                  }}>
                  2
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ width: width * 0.085 }}
              onPress={() => handleModuleCountSelect(3)}
            >
              <LinearGradient
                colors={selectedModuleCount === 3 ? ['#4E35D7', '#1A0F32'] :  ['#AEAEAE', '#AEAEAE'] }
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{
                  padding: width * 0.025,
                  borderRadius: width * 0.05,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: '#ffffff',
                }}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: width * 0.025,
                    fontFamily: 'AlbertSans-Bold',
                    textAlign: 'center',
                  }}>
                  3
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default YildizModule;
