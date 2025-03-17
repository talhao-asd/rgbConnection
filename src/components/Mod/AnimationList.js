import { View, Text, FlatList, TouchableOpacity, StyleSheet, LayoutAnimation, UIManager, Platform } from 'react-native'
import React, { useCallback, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedAnimation } from '../../redux/slices/modSlice'

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const AnimationList = () => {
  const dispatch = useDispatch();
  const { selectedAnimation, animations } = useSelector(state => state.mod);
  const flatListRef = useRef(null);
  
  useEffect(() => {
    // Scroll to the selected animation when component mounts
    // Account for 1-indexed animation selection (selectedAnimation - 1 for the index)
    if (flatListRef.current && selectedAnimation !== null) {
      // Need to adjust for 1-indexing back to 0-indexing for the flatlist
      const listIndex = selectedAnimation - 1;
      if (listIndex >= 0) {
        flatListRef.current.scrollToIndex({
          index: listIndex,
          animated: false,
          viewPosition: 0.5
        });
      }
    }
  }, []);

  const handleItemPress = useCallback((index) => {
    // Configure smooth layout animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // Use index + 1 to ensure animations start from 1 not 0
    dispatch(setSelectedAnimation(index + 1));
    
    // Scroll to the selected item
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5
    });
  }, [dispatch]);

  const renderItem = useCallback(({ item, index }) => {
    // Check if the current animation is selected (index + 1 because we're 1-indexing animations)
    const isSelected = selectedAnimation === index + 1;
    
    return (
      <TouchableOpacity
        onPress={() => handleItemPress(index)}
        style={[
          styles.item,
          { 
            backgroundColor: isSelected ? '#FFFFFF' : '#666666',
            // Fixed width for all items to prevent shifting
            width: 270
          }
        ]}
      >
        <Text style={{ 
          color: isSelected ? '#000000' : '#FFFFFF',
          textAlign: 'center',
          fontFamily: 'AlbertSans-Medium'
        }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedAnimation, handleItemPress]);

  const getItemLayout = useCallback((data, index) => ({
    length: 56, // height + marginVertical
    offset: 56 * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={animations}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        initialScrollIndex={selectedAnimation !== null ? selectedAnimation - 1 : 0}
        getItemLayout={getItemLayout}
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={6}
        windowSize={11}
        initialNumToRender={6}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        onScrollToIndexFailed={() => {}}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    height: 350, // Reduced height
  },
  list: {
    width: '100%', // Ensure the list takes full width of container
  },
  listContent: {
    paddingVertical: 5, // Reduced padding
  },
  item: {
    height: 45, // Reduced height
    borderRadius: 16,
    marginVertical: 5, // Reduced margin
    alignSelf: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41
  }
});

export default AnimationList