import { View, SafeAreaView } from 'react-native'
import React, { memo, useMemo } from 'react'
import ColorWheel from '../Rgb/ColorWheel'
import Speed from '../Rgb/Speed'
import Footer from '../Footer'
import { useSelector } from 'react-redux'

const Rgb = memo(() => {
  // Use more specific selectors to prevent unnecessary re-renders
  const rgbState = useSelector(state => state.rgb);
  
  // Memoize child components to prevent unnecessary re-renders
  const colorWheelComponent = useMemo(() => <ColorWheel />, []);
  const speedComponent = useMemo(() => <Speed />, []);
  const footerComponent = useMemo(() => <Footer />, []);
  
  return (
    <SafeAreaView style={{ flex: 1, gap: 10 }}>
      {colorWheelComponent}
      {speedComponent}
      {footerComponent}
    </SafeAreaView>
  )
});

export default Rgb