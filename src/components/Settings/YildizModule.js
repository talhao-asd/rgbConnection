import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'; // veya başka bir ikon seti
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { setModuleCount } from '../../redux/slices/yildizSlice';

const YildizModule = ({onBack}) => {
  const dispatch = useDispatch();
  const selectedModuleCount = useSelector(state => state.yildiz.moduleCount);
  
  const handleModuleCountSelect = (count) => {
    dispatch(setModuleCount(count));
  };

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
            colors={['#1A0F32', '#4E35D7']}
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
                color: '#ffffff',
                fontSize: 12,
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
          fontSize: 16,
          fontFamily: 'AlbertSans-Regular',
        }}>
        Yıldız modunu kullanmak için cihazın modül adedini seçiniz.
      </Text>
      <View
        style={{
          marginTop: 20,
          backgroundColor: '#000000',
          padding: 10,
          borderRadius: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            width: 260,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: '#ffffff',
              fontSize: 16,
              fontFamily: 'AlbertSans-Regular',
            }}>
            Modül Sayısı
          </Text>
          <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
            <TouchableOpacity 
              style={{ width: 35 }}
              onPress={() => handleModuleCountSelect(1)}
            >
              <LinearGradient
                colors={selectedModuleCount === 1 ? ['#4E35D7', '#1A0F32'] : ['#1A0F32', '#4E35D7']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{
                  padding: 10,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: selectedModuleCount === 1 ? 2 : 0,
                  borderColor: '#ffffff',
                }}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 12,
                    fontFamily: 'AlbertSans-Bold',
                    textAlign: 'center',
                  }}>
                  1
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ width: 35 }}
              onPress={() => handleModuleCountSelect(2)}
            >
              <LinearGradient
                colors={selectedModuleCount === 2 ? ['#4E35D7', '#1A0F32'] : ['#1A0F32', '#4E35D7']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{
                  padding: 10,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: selectedModuleCount === 2 ? 2 : 0,
                  borderColor: '#ffffff',
                }}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 12,
                    fontFamily: 'AlbertSans-Bold',
                    textAlign: 'center',
                  }}>
                  2
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ width: 35 }}
              onPress={() => handleModuleCountSelect(3)}
            >
              <LinearGradient
                colors={selectedModuleCount === 3 ? ['#4E35D7', '#1A0F32'] : ['#1A0F32', '#4E35D7']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{
                  padding: 10,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: selectedModuleCount === 3 ? 2 : 0,
                  borderColor: '#ffffff',
                }}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 12,
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
