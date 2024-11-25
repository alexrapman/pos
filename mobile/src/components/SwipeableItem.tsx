// mobile/src/components/SwipeableItem.tsx
import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useGestureAnimation } from '../hooks/useGestureAnimation';

export const SwipeableItem = ({ children, onSwipe }) => {
  const { pan, opacity, panResponder } = useGestureAnimation();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y }
          ],
          opacity
        }
      ]}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2
  }
});