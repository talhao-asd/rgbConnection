import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Slider from '../Slider';
import { useDispatch, useSelector } from 'react-redux';
import { setSpeed } from '../../redux/slices/rgbSlice';

const Speed = () => {
  const dispatch = useDispatch();
  const { speed } = useSelector(state => state.rgb);

  const handleSpeedChange = (value) => {
    dispatch(setSpeed(value));
  };

  return (
    <View style={styles.container}>
      <Slider
        label="Parlaklık"
        value={speed}
        onValueChange={handleSpeedChange}
        gradientColors={['#F38181', '#FCE38A']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
  },
});

export default Speed;
