import React, {useState, useEffect, useCallback, memo} from 'react';
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
  
  // Convert RGB object to hex for the color picker
  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
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

  // Special white color code for ESP32 - you can replace this with whatever code your device needs
  const ESP32_WHITE_CODE = '#FFFFFF'; // Change this to the special code needed by your ESP32

  // Use useCallback to memoize the handler function
  const handleColorChange = useCallback(
    color => {
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
      setSelectedColor(color);
      // Convert hex to RGB and dispatch to Redux
      const rgbColor = hexToRgb(color);
      if (rgbColor) {
        dispatch(setColor(rgbColor));
      }
    },
    [dispatch],
  );

  // Special handler for white button
  const handleWhitePress = useCallback(() => {
    setSelectedColor(ESP32_WHITE_CODE);
    dispatch(setColor({r: 255, g: 255, b: 255}));
  }, [dispatch]);

  return (
    <View style={styles.container}>
      {/* Color Presets */}

      {/* Container for both the color wheel and the white button */}
      <View
        style={[styles.wheelContainer, {width: wheelSize, height: wheelSize}]}>
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
