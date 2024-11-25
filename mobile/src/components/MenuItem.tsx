// mobile/src/components/MenuItem.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Animated } from 'react-native';

interface MenuItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
  };
  onPress: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, onPress }) => {
  const scaleAnim = new Animated.Value(1);

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      })
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity onPress={handlePress}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
