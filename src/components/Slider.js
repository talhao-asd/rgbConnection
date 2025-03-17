import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SLIDER_WIDTH = 300;
const SLIDER_HEIGHT = 30;
const BORDER_WIDTH = 2; // Width of the border

// Throttle time in ms - increase for less sensitivity (33ms = ~30fps)
// Increase to 50ms for better performance (20fps is still smooth enough for a slider)
const THROTTLE_TIME = 50;
// Minimum movement threshold in pixels - increase for less sensitivity
const MOVEMENT_THRESHOLD = 5;

const Slider = memo(({ 
  label = "Animasyon Hızı", 
  value = 10, 
  onValueChange = () => {},
  onSlidingComplete = null,
  minimumValue = 1,
  maximumValue = 10,
  stepSize = 1,
  gradientColors = ['#3C1053', '#AD5389'],
}) => {
  // Round initial value to nearest step
  const roundedInitialValue = Math.round(value / stepSize) * stepSize;
  
  // Create refs outside of render for better performance
  const currentValueRef = useRef(roundedInitialValue);
  const [displayValue, setDisplayValue] = useState(roundedInitialValue);
  const fillWidthRef = useRef(new Animated.Value(0)).current;
  const isTrackingRef = useRef(false);
  const lastUpdateTimeRef = useRef(0);
  const lastPositionRef = useRef(0);
  const lastValueRef = useRef(roundedInitialValue);
  const viewRef = useRef(null);
  const layoutRef = useRef({ x: 0, width: SLIDER_WIDTH });
  
  // Flag to track if we should call onValueChange during sliding
  const shouldCallOnValueChange = useRef(onSlidingComplete === null).current;
  
  // Define the calculateWidth function with larger minimum width
  const calculateWidth = useRef((val) => {
    if (val <= minimumValue) return 40; // Minimum width
    
    const percentage = (val - minimumValue) / (maximumValue - minimumValue);
    return 40 + percentage * (SLIDER_WIDTH - 40);
  }).current;
  
  // Set initial width
  useEffect(() => {
    fillWidthRef.setValue(calculateWidth(roundedInitialValue));
  }, []);
  
  // Update animated value when props change
  useEffect(() => {
    if (!isTrackingRef.current) {
      // Round the incoming value to the nearest step
      const roundedValue = Math.round(value / stepSize) * stepSize;
      fillWidthRef.setValue(calculateWidth(roundedValue));
      setDisplayValue(roundedValue);
      currentValueRef.current = roundedValue;
      lastValueRef.current = roundedValue;
    }
  }, [value, minimumValue, maximumValue, stepSize]);

  // Calculate value from position with reduced sensitivity
  const calculateValueFromPosition = useRef((position) => {
    // Clamp position to slider bounds
    const clampedPosition = Math.max(0, Math.min(position, SLIDER_WIDTH));
    
    // Calculate value with reduced sensitivity
    let newValue;
    if (clampedPosition <= 40) {
      newValue = minimumValue;
    } else {
      const percentage = (clampedPosition - 40) / (SLIDER_WIDTH - 40);
      // Round to nearest step size for less sensitivity
      newValue = Math.round((minimumValue + percentage * (maximumValue - minimumValue)) / stepSize) * stepSize;
      
      // Ensure the value is within bounds
      newValue = Math.max(minimumValue, Math.min(maximumValue, newValue));
    }
    
    return newValue;
  }).current;

  // Update slider position and value with optimized calculation
  const updateSlider = useRef((position) => {
    // Calculate new value
    const newValue = calculateValueFromPosition(position);
    
    // Only update if value changed
    if (newValue !== lastValueRef.current) {
      // Update value ref
      currentValueRef.current = newValue;
      lastValueRef.current = newValue;
      
      // Update fill width
      fillWidthRef.setValue(calculateWidth(newValue));
      
      // Update display value (less frequently)
      setDisplayValue(newValue);
      
      // Only call callback during slide if no onSlidingComplete callback is provided
      if (shouldCallOnValueChange) {
        onValueChange(newValue);
      }
    }
  }).current;

  // Create pan responder with improved gesture handling
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      isTrackingRef.current = true;
      
      // Get the absolute position
      const { locationX } = evt.nativeEvent;
      lastPositionRef.current = locationX;
      
      // Update slider immediately on touch
      updateSlider(locationX);
    },
    onPanResponderMove: (evt, gestureState) => {
      // Throttle updates for smoother performance
      const now = Date.now();
      if (now - lastUpdateTimeRef.current < THROTTLE_TIME) {
        return;
      }
      
      // Get position relative to the slider
      const newPosition = Math.max(0, Math.min(
        gestureState.moveX - layoutRef.current.x, 
        layoutRef.current.width
      ));
      
      // Only update if position changed significantly
      if (Math.abs(newPosition - lastPositionRef.current) > MOVEMENT_THRESHOLD) {
        lastUpdateTimeRef.current = now;
        lastPositionRef.current = newPosition;
        updateSlider(newPosition);
      }
    },
    onPanResponderRelease: () => {
      // Call onSlidingComplete with the final value if provided
      if (onSlidingComplete) {
        onSlidingComplete(currentValueRef.current);
      }
      
      // Delay setting tracking to false to prevent jumps
      setTimeout(() => {
        isTrackingRef.current = false;
      }, 50);
    }
  }), [onSlidingComplete, shouldCallOnValueChange]);

  // Handle layout to get the actual position and width
  const onLayout = (event) => {
    const { x, width } = event.nativeEvent.layout;
    layoutRef.current = { x, width };
  };

  // Memoize the label and value text to prevent re-renders
  const labelElement = useMemo(() => (
    <Text style={styles.label}>{label}</Text>
  ), [label]);

  const valueElement = useMemo(() => (
    <Text style={styles.valueText}>{displayValue}</Text>
  ), [displayValue]);

  // Memoize the gradient to prevent re-renders
  const gradientElement = useMemo(() => (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.fill}
    />
  ), [gradientColors]);

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {labelElement}
        {valueElement}
      </View>
      <View 
        style={styles.sliderContainer}
        ref={viewRef}
        onLayout={onLayout}
      >
        <View style={[styles.borderContainer]}>
          <View 
            style={styles.track} 
            {...panResponder.panHandlers}
          >
            <Animated.View 
              style={[
                styles.fillContainer, 
                { width: fillWidthRef },
                // Add hardware acceleration
                Platform.select({
                  android: { 
                    renderToHardwareTextureAndroid: true,
                    collapsable: false
                  },
                  ios: { 
                    shouldRasterizeIOS: true,
                    opacity: 0.99 // Force hardware acceleration on iOS
                  }
                })
              ]}
              removeClippedSubviews={true}
            >
              {gradientElement}
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: SLIDER_WIDTH,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'AlbertSans-Regular',
    marginLeft: 15,
  },
  valueText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'AlbertSans-Regular',
    marginRight: 10,
  },
  sliderContainer: {
    height: SLIDER_HEIGHT + (BORDER_WIDTH * 2),
    width: SLIDER_WIDTH + (BORDER_WIDTH * 2),
    justifyContent: 'center',
  },
  borderContainer: {
    height: SLIDER_HEIGHT + (BORDER_WIDTH * 2),
    width: SLIDER_WIDTH + (BORDER_WIDTH * 2),
    borderRadius: (SLIDER_HEIGHT + (BORDER_WIDTH * 2)) / 2,
    borderWidth: BORDER_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  track: {
    height: SLIDER_HEIGHT,
    width: SLIDER_WIDTH,
    backgroundColor: '#000000',
    borderRadius: SLIDER_HEIGHT / 2,
    overflow: 'hidden',
  },
  fillContainer: {
    height: SLIDER_HEIGHT,
    overflow: 'hidden',
    borderRadius: SLIDER_HEIGHT / 2,
  },
  fill: {
    height: SLIDER_HEIGHT,
    width: SLIDER_WIDTH,
    borderRadius: SLIDER_HEIGHT / 2,
  },
});

export default Slider; 