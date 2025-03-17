import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Slider from '../Slider';
import { useDispatch, useSelector } from 'react-redux';
import { setAnimationSpeed, setLightIntensity } from '../../redux/slices/modSlice';

const Speed = () => {
  const dispatch = useDispatch();
  const { animationSpeed, lightIntensity } = useSelector(state => state.mod);
  
  const handleAnimationSpeedChange = (value) => {
    dispatch(setAnimationSpeed(value));
  };
  
  const handleLightIntensityChange = (value) => {
    dispatch(setLightIntensity(value));
  };

  return (
    <View style={styles.container}>
      <Slider
        label="Animasyon Hızı"
        value={animationSpeed || 5}
        onValueChange={handleAnimationSpeedChange}
        gradientColors={['#3C1053', '#AD5389']}
        minimumValue={1}
        maximumValue={10}
        stepSize={1}
      />
      <Slider
        label="Parlaklık"
        value={lightIntensity || 50}
        onValueChange={handleLightIntensityChange}
        gradientColors={['#3C1053', '#AD5389']}
        minimumValue={1}
        maximumValue={99}
        stepSize={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default Speed;
