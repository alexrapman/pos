// mobile/src/hooks/useGestureAnimation.ts
import { useRef } from 'react';
import { Animated, PanResponder } from 'react-native';

export const useGestureAnimation = () => {
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      { dx: pan.x, dy: pan.y }
    ], { useNativeDriver: false }),
    onPanResponderRelease: (_, gesture) => {
      if (Math.abs(gesture.dx) > 120) {
        Animated.parallel([
          Animated.timing(pan.x, {
            toValue: gesture.dx > 0 ? 500 : -500,
            useNativeDriver: false
          }),
          Animated.timing(opacity, {
            toValue: 0,
            useNativeDriver: false
          })
        ]).start();
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false
        }).start();
      }
    }
  });

  return { pan, opacity, panResponder };
};