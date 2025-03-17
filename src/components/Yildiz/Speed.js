import React, { useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Slider from '../Slider';
import { useDispatch, useSelector } from 'react-redux';
import { setAnimationSpeed, setWaitingTime } from '../../redux/slices/yildizSlice';

const Speed = ({ moduleCount }) => {
  const dispatch = useDispatch();
  const { animationSpeed, waitingTime } = useSelector(state => state.yildiz);
  
  // Local state for smooth UI updates during sliding
  const [localAnimationSpeed, setLocalAnimationSpeed] = useState(animationSpeed || 10);
  const [localWaitingTime, setLocalWaitingTime] = useState(waitingTime || 10);

  // Update local state during sliding without Redux dispatch
  const handleAnimationSpeedChange = (value) => {
    setLocalAnimationSpeed(value);
  };

  // Only dispatch to Redux when sliding completes
  const handleAnimationSpeedComplete = (value) => {
    dispatch(setAnimationSpeed(value));
  };

  // Update local state during sliding without Redux dispatch
  const handleWaitingTimeChange = (value) => {
    setLocalWaitingTime(value);
  };

  // Only dispatch to Redux when sliding completes
  const handleWaitingTimeComplete = (value) => {
    dispatch(setWaitingTime(value));
  };

  return (
    <View style={styles.container}>
      <Slider
        label="Animasyon Hızı"
        value={animationSpeed || 10}
        onValueChange={handleAnimationSpeedChange}
        onSlidingComplete={handleAnimationSpeedComplete}
        gradientColors={['#3C1053', '#AD5389']}
        minimumValue={1}
        maximumValue={10}
        stepSize={1}
      />
      <Slider
        label="Parlaklık"
        value={waitingTime || 10}
        onValueChange={handleWaitingTimeChange}
        onSlidingComplete={handleWaitingTimeComplete}
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
    gap: 5,
    marginVertical: 5,
  },
});

export default Speed;
