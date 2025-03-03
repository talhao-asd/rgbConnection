import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React, { memo, useMemo } from 'react';
import AnimationMod from '../KayanYildiz/AnimationMod';
import Speed from '../KayanYildiz/Speed';
import Direction from '../KayanYildiz/Direction';
import Footer from '../Footer';
import { useSelector } from 'react-redux';

const KayanYildiz = memo(({moduleCount = 1}) => {
  // Use more specific selectors to prevent unnecessary re-renders
  const kayanYildizState = useSelector(state => state.kayanYildiz);
  
  // Memoize child components to prevent unnecessary re-renders
  const animationModComponent = useMemo(() => <AnimationMod moduleCount={moduleCount} />, [moduleCount]);
  const speedComponent = useMemo(() => <Speed moduleCount={moduleCount} />, [moduleCount]);
  const directionComponent = useMemo(() => <Direction moduleCount={moduleCount} />, [moduleCount]);
  const footerComponent = useMemo(() => <Footer bleManager={bleManager} mode="K" />
  , []);
  
  return (
    <View style={{flex: 1, backgroundColor: '#080808'}}>
      <View style={{gap: 10}}>
        {animationModComponent}
        {speedComponent}
        {directionComponent}
      </View>
      {footerComponent}
    </View>
  );
});

export default KayanYildiz;
