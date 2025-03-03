import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Slider from '../Slider';
import { useDispatch, useSelector } from 'react-redux';
import { setAnimationSpeed } from '../../redux/slices/modSlice';

const Speed = () => {
  const dispatch = useDispatch();
  const { animationSpeed } = useSelector(state => state.mod);

  const handleAnimationSpeedChange = (value) => {
    dispatch(setAnimationSpeed(value));
  };

  return (
    <View style={styles.container}>
      <Slider
        label="Animasyon Hızı"
        value={animationSpeed}
        onValueChange={handleAnimationSpeedChange}
        gradientColors={['#3C1053', '#AD5389']}
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
