import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';
import {useDispatch, useSelector} from 'react-redux';
import {setSpeed} from '../../redux/slices/rgbSlice';

const Speed = memo(() => {
  const dispatch = useDispatch();
  const {speed} = useSelector(state => state.rgb);

  const handleSpeedChange = value => {
    // Convert to integer and ensure it's between 1-99
    const normalizedSpeed = Math.max(1, Math.min(99, Math.round(value)));
    dispatch(setSpeed(normalizedSpeed));
  };

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={99}
        value={speed}
        onValueChange={handleSpeedChange}
        minimumTrackTintColor="#2196F3"
        maximumTrackTintColor="#000000"
        thumbTintColor="#2196F3"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default Speed;
