import React, {useState, useEffect, useCallback, memo, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import {useDispatch, useSelector} from 'react-redux';
import {setColor} from '../../redux/slices/rgbSlice';

// Use memo to prevent unnecessary re-renders
const ColorWheelPicker = memo(() => {
  const dispatch = useDispatch();
  const {color} = useSelector(state => state.rgb);
  
  // Flag to track if we're in white button mode to prevent ColorPicker from overriding
  const isWhiteButtonMode = useRef(false);
  
  // Convert RGB object to hex for the color picker
  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          w: 0, // Reset white value to 0 when selecting a colored light
        }
      : null;
  };
  
  const [selectedColor, setSelectedColor] = useState(rgbToHex(color.r, color.g, color.b));
  const wheelSize = Math.min(Dimensions.get('window').width - 80, 300);

  // Predefined color presets including white for ESP32
  const colorPresets = [
    '#FFC107', // Amber
    '#FF5722', // Deep Orange
    '#E91E63', // Pink
    '#9C27B0', // Purple
    '#2196F3', // Blue
  ];

  // Use useCallback to memoize the handler function
  const handleColorChange = useCallback(
    color => {
      // Skip if we're in white button mode to prevent overriding white settings
      if (isWhiteButtonMode.current) {
        console.log('ColorPicker change ignored because white button is active');
        return;
      }
      
      setSelectedColor(color);
      // Convert hex to RGB and dispatch to Redux
      const rgbColor = hexToRgb(color);
      if (rgbColor) {
        dispatch(setColor(rgbColor));
      }
    },
    [dispatch],
  );

  // Use useCallback for preset handlers to avoid recreating on every render
  const handlePresetPress = useCallback(
    color => {
      // Exit white button mode when pressing a preset
      isWhiteButtonMode.current = false;
      
      setSelectedColor(color);
      // Convert hex to RGB and dispatch to Redux
      const rgbColor = hexToRgb(color);
      if (rgbColor) {
        dispatch(setColor(rgbColor));
      }
    },
    [dispatch],
  );

  // Special handler for white button - sets RGB to 5,5,5 and white to 99
  const handleWhitePress = useCallback(() => {
    // Enter white button mode to prevent color picker from overriding
    isWhiteButtonMode.current = true;
    
    // For white light using the W channel, set RGB to 5,5,5 (instead of 0,0,0) and W to 99
    const whiteColor = {
      r: 0,  // Use 5 instead of 0 to ensure the command works correctly
      g: 0,  // Use 5 instead of 0 to ensure the command works correctly
      b: 0,  // Use 5 instead of 0 to ensure the command works correctly
      w: 99  // Use maximum white value
    };
    
    // We still visually show white in the color picker
    setSelectedColor('#FFFFFF');
    
    // Dispatch the white color settings to the Redux store
    dispatch(setColor(whiteColor));
    
    console.log('White button pressed - setting RGB to 050505 and W to 99');
  }, [dispatch]);

  // Add an effect to exit white button mode when user interacts with color wheel
  const handlePickerTouchStart = useCallback(() => {
    if (isWhiteButtonMode.current) {
      console.log('User touched color wheel - exiting white button mode');
      isWhiteButtonMode.current = false;
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Container for both the color wheel and the white button */}
      <View 
        style={[styles.wheelContainer, {width: wheelSize, height: wheelSize}]}
        onTouchStart={handlePickerTouchStart}>
        {/* Color Wheel */}
        <ColorPicker
          color={selectedColor}
          onColorChangeComplete={handleColorChange}
          thumbSize={20}
          sliderSize={20}
          noSnap={false}
          swatches={false}
          // Performance optimizations
          autoResetSlider={false}
          shadeWheelThumb={true}
          shadeSliderThumb={true}
          renderThumb={() => <View style={styles.thumbStyle} />}
        />

        {/* Overlay with white button in absolute center */}
        <View style={styles.centerOverlay}>
          <TouchableOpacity
            style={styles.whiteButton}
            onPress={handleWhitePress}>
            <Text style={styles.whiteButtonText}>W</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.presetContainer}>
        {colorPresets.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.presetColor, {backgroundColor: color}]}
            onPress={() => handlePresetPress(color)}
          />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  presetContainer: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-around',
    width: '70%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
  },
  presetColor: {
    width: 32,
    height: 32,
    borderRadius: 17.5,
    borderWidth: 2,
    borderColor: 'white',
  },
  wheelContainer: {
    position: 'relative',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
  },
  centerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 35,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  thumbStyle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  whiteButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000000',
    zIndex: 999,
  },
  whiteButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ColorWheelPicker;
