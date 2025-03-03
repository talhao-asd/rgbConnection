import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useDispatch, useSelector } from 'react-redux'
import { setDirection } from '../../redux/slices/kayanYildizSlice'

const Direction = ({ moduleCount }) => {
  const dispatch = useDispatch();
  const { direction } = useSelector(state => state.kayanYildiz);
  const screenWidth = Dimensions.get('window').width;
  
  const handleLeftPress = () => {
    dispatch(setDirection('left'));
  };
  
  const handleRightPress = () => {
    dispatch(setDirection('right'));
  };
  
  return (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      alignSelf: 'center', 
      marginTop: '5%', 
      justifyContent: 'space-between', 
      paddingHorizontal: '10%', 
      width: '85%' 
    }}>
      <TouchableOpacity onPress={handleLeftPress}>
        <Icon 
          name="arrow-left" 
          size={screenWidth * 0.06} 
          color={direction === 'left' ? '#CAEF46' : '#FFFFFF'} 
        />
      </TouchableOpacity>
      <Text style={{ color: 'white', fontSize: screenWidth * 0.06, fontFamily: 'AlbertSans-Regular' }}>YÖN</Text>
      <TouchableOpacity onPress={handleRightPress}>
        <Icon 
          name="arrow-right" 
          size={screenWidth * 0.06} 
          color={direction === 'right' ? '#CAEF46' : '#FFFFFF'} 
        />
      </TouchableOpacity>
    </View>
  )
}

export default Direction