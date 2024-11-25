// mobile/src/hooks/useAnimatedFeedback.ts
import { useRef } from 'react';
import { Animated, Easing } from 'react-native';

export const useAnimatedFeedback = () => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  
  const animatePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 8,
      tension: 100
    }).start();
  };

  const animatePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 100
    }).start();
  };

  return { scaleValue, animatePressIn, animatePressOut };
};