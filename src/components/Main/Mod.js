import { View } from 'react-native'
import React, { memo, useMemo } from 'react'
import AnimationList from '../Mod/AnimationList'
import Speed from '../Mod/Speed'
import Footer from '../Footer'
import { useSelector } from 'react-redux'

const Mod = memo(() => {
  // Use more specific selectors to prevent unnecessary re-renders
  const modState = useSelector(state => state.mod);
  
  // Memoize child components to prevent unnecessary re-renders
  const animationListComponent = useMemo(() => <AnimationList />, []);
  const speedComponent = useMemo(() => <Speed />, []);
  const footerComponent = useMemo(() => <Footer />, []);
  
  return (
    <View style={{flex: 1, backgroundColor: '#080808'}}>
      <View style={{gap: 0}}>
        {animationListComponent}
        {speedComponent}
      </View>
      {footerComponent}
    </View>
  )
});

export default Mod