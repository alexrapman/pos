// mobile/src/utils/animations.ts
import { Animated, Easing } from 'react-native';

export class AnimationUtils {
  static fadeIn(value: Animated.Value, duration = 300) {
    return Animated.timing(value, {
      toValue: 1,
      duration,
      useNativeDriver: true,
      easing: Easing.ease
    });
  }

  static scaleInOut(value: Animated.Value) {
    return Animated.sequence([
      Animated.spring(value, {
        toValue: 1.2,
        useNativeDriver: true,
        friction: 3
      }),
      Animated.spring(value, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3
      })
    ]);
  }
}