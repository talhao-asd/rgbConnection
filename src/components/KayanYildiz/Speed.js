import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Slider from '../Slider';
import { useDispatch, useSelector } from 'react-redux';
import { setAnimationSpeed, setWaitingTime, setLightIntensity } from '../../redux/slices/kayanYildizSlice';

const Speed = ({ moduleCount }) => {
  const dispatch = useDispatch();
  const { animationSpeed, waitingTime, lightIntensity } = useSelector(state => state.kayanYildiz);

  const handleAnimationSpeedChange = (value) => {
    dispatch(setAnimationSpeed(value));
  };

  const handleWaitingTimeChange = (value) => {
    dispatch(setWaitingTime(value));
  };

  const handleLightIntensityChange = (value) => {
    dispatch(setLightIntensity(value));
  };

  return (
    <View style={styles.container}>
      <Slider
        label="Animasyon Hızı"
        value={animationSpeed}
        onValueChange={handleAnimationSpeedChange}
        gradientColors={['#3C1053', '#AD5389']}
      />
      <Slider
        label="Bekleme Süresi"
        value={waitingTime}
        onValueChange={handleWaitingTimeChange}
        gradientColors={['#3C1053', '#AD5389']}
      />
      <Slider
        label="Işık Yoğunluğu"
        value={lightIntensity}
        onValueChange={handleLightIntensityChange}
        gradientColors={['#3C1053', '#AD5389']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 5,
    marginVertical: 5,
  },
});

export default Speed;
