// mobile/src/components/AnimatedListItem.tsx
import React, { useRef, useEffect } from 'react';
import { 
  Animated, 
  PanResponder, 
  StyleSheet, 
  Dimensions 
} from 'react-native';

interface AnimatedListItemProps {
  children: React.ReactNode;
  onRemove?: () => void;
  onReorder?: (direction: 'up' | 'down') => void;
  index: number;
}

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

export const AnimatedListItem = ({ 
  children, 
  onRemove, 
  onReorder,
  index 
}: AnimatedListItemProps) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const itemHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx, dy }) => {
      translateX.setValue(dx);
      translateY.setValue(dy);
    },
    onPanResponderRelease: (_, { dx, dy }) => {
      if (Math.abs(dx) > SWIPE_THRESHOLD && onRemove) {
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: dx > 0 ? width : -width,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          })
        ]).start(onRemove);
      } else if (Math.abs(dy) > 50 && onReorder) {
        onReorder(dy < 0 ? 'up' : 'down');
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX },
            { translateY },
            { scale }
          ]
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
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});