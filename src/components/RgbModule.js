import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WheelPicker } from '@openmobilehub/react-native-wheel-picker';
import BLEService from '../services/BLEService';
import {Slider} from '@react-native-community/slider'

const RgbModule = ({deviceId}) => {
  const [brightness, setBrightness] = useState(50);
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [powerStatus, setPowerStatus] = useState('0');
  
  // Use useRef to store the BLEService instance
  const bleServiceRef = useRef(null);
  
  // Initialize BLEService once when component mounts
  useEffect(() => {
    bleServiceRef.current = new BLEService();
    
    // Clean up when component unmounts
    return () => {
      // Any cleanup needed for BLEService
    };
  }, []);

  // RGB pattern list matching B4A implementation
  const patterns = [
    'Kapat', 'Sabit Kırmızı', 'Sabit Yeşil', 'Sabit Mavi', 'Sabit Beyaz',
    'Kırmızı-Yeşil-Mavi-Beyaz', 'Üç Renk Soğuk Geçiş', 'Üç Renk Sıcak Geçiş',
    'Kırmızı Yeşil Geçişli', 'Yeşil Mavi Geçişli', 'Kırmızı Mavi Geçişli',
    'Yedi Renk Sıcak Geçişli', 'Yedi Renk Soğuk Geçişli', 'Tüm Renk Geçişli'
  ];

  const sendRGBCommand = async () => {
    const patternCode = selectedPattern.toString().padStart(2, '0');
    const brightnessCode = brightness.toString().padStart(2, '0');
    const command = `>${powerStatus}R${patternCode}${brightnessCode}|`;
    
    if (bleServiceRef.current) {
      await bleServiceRef.current.writeDataToDevice(
        deviceId,
        command,
        '0000FFE0-0000-1000-8000-00805F9B34FB',
        '0000FFE1-0000-1000-8000-00805F9B34FB'
      );
    }
  };

  const togglePower = () => {
    const newPowerStatus = powerStatus === '0' ? '1' : '0';
    setPowerStatus(newPowerStatus);
    // Send command after state update
    setTimeout(() => {
      sendRGBCommand();
    }, 100);
  };

  const handlePatternChange = (index) => {
    setSelectedPattern(index);
    // Send command after state update
    setTimeout(() => {
      sendRGBCommand();
    }, 100);
  };

  const handleBrightnessChange = (value) => {
    setBrightness(Math.round(value));
  };

  const handleBrightnessComplete = () => {
    sendRGBCommand();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RGB Kontrol</Text>
      
      {/* Power Button */}
      <TouchableOpacity 
        style={[styles.powerButton, powerStatus === '1' ? styles.powerOn : styles.powerOff]} 
        onPress={togglePower}
      >
        <Icon name="power-settings-new" size={24} color="white" />
        <Text style={styles.powerText}>
          {powerStatus === '1' ? 'AÇIK' : 'KAPALI'}
        </Text>
      </TouchableOpacity>
      
      {/* Pattern Selector */}
      <View style={styles.patternContainer}>
        <Text style={styles.sectionTitle}>Desen Seçimi</Text>
        <View style={styles.pickerContainer}>
          <WheelPicker
            selectedIndex={selectedPattern}
            options={patterns}
            onChange={handlePatternChange}
            visibleRest={2}
            itemTextStyle={styles.pickerItemText}
            selectedIndicatorStyle={styles.pickerIndicator}
          />
        </View>
      </View>
      
      {/* Brightness Control */}
      <View style={styles.brightnessContainer}>
        <Text style={styles.sectionTitle}>Parlaklık: {brightness}%</Text>
        <View style={styles.sliderContainer}>
          <Icon name="brightness-low" size={20} color="#AAAAAA" />
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={brightness}
            onValueChange={handleBrightnessChange}
            onSlidingComplete={handleBrightnessComplete}
            minimumTrackTintColor="#CAEF46"
            maximumTrackTintColor="#333333"
            thumbTintColor="#CAEF46"
          />
          <Icon name="brightness-high" size={20} color="#FFFFFF" />
        </View>
      </View>
      
      {/* Color Preview */}
      <LinearGradient
        colors={['#FF0000', '#00FF00', '#0000FF', '#FFFFFF']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.colorPreview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  powerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    marginBottom: 20,
  },
  powerOn: {
    backgroundColor: '#CAEF46',
  },
  powerOff: {
    backgroundColor: '#333333',
  },
  powerText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  patternContainer: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    overflow: 'hidden',
  },
  pickerItemText: {
    color: '#FFFFFF',
  },
  pickerIndicator: {
    backgroundColor: 'rgba(202, 239, 70, 0.2)',
  },
  brightnessContainer: {
    width: '100%',
    marginBottom: 20,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  colorPreview: {
    height: 20,
    width: '100%',
    borderRadius: 10,
    marginTop: 20,
  },
});

export default RgbModule;
