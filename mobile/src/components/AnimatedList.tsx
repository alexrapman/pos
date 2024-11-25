// mobile/src/components/AnimatedList.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, LayoutAnimation } from 'react-native';

interface AnimatedListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  style?: ViewStyle;
}

export function AnimatedList<T>({ data, renderItem, keyExtractor, style }: AnimatedListProps<T>) {
  const fadeAnims = useRef<Animated.Value[]>([]);

  useEffect(() => {
    // Initialize animation values for new items
    fadeAnims.current = data.map((_, i) => 
      fadeAnims.current[i] || new Animated.Value(0)
    );

    // Stagger animations
    const animations = fadeAnims.current.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: i * 50,
        useNativeDriver: true
      })
    );

    Animated.parallel(animations).start();
  }, [data.length]);

  // Configure layout animation
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [data]);

  return (
    <Animated.View style={style}>
      {data.map((item, index) => (
        <Animated.View
          key={keyExtractor(item)}
          style={{
            opacity: fadeAnims.current[index],
            transform: [{
              translateY: fadeAnims.current[index].interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })
            }]
          }}
        >
          {renderItem(item, index)}
        </Animated.View>
      ))}
    </Animated.View>
  );
}