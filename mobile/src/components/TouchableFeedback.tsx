// mobile/src/components/TouchableFeedback.tsx
import React from 'react';
import { Animated, TouchableWithoutFeedback } from 'react-native';
import { useAnimatedFeedback } from '../hooks/useAnimatedFeedback';

export const TouchableFeedback = ({ children, onPress }) => {
  const { scaleValue, animatePressIn, animatePressOut } = useAnimatedFeedback();

  return (
    <TouchableWithoutFeedback
      onPressIn={animatePressIn}
      onPressOut={animatePressOut}
      onPress={onPress}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};