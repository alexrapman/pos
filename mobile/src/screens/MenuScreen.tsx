// mobile/src/screens/MenuScreen.tsx
import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useQuery } from 'react-query';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

export const MenuScreen = ({ route, navigation }) => {
  const { tableId } = route.params;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: menu, isLoading } = useQuery('menu', async () => {
    const response = await fetch(`${API_URL}/api/menu`);
    return response.json();
  });

  const categories = menu ? [...new Set(menu.map(item => item.category))] : [];

  const filteredMenu = menu?.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const addToCart = (item: MenuItem) => {
    // Cart management will be implemented next
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={['all', ...categories]}
        renderItem={({ item }) => (
          <CategoryButton 
            title={item} 
            selected={selectedCategory === item}
            onPress={() => setSelectedCategory(item)}
          />
        )}
        style={styles.categories}
      />

      <FlatList
        data={filteredMenu}
        renderItem={({ item }) => (
          <MenuItem 
            item={item}
            onPress={() => addToCart(item)}
          />
        )}
        numColumns={2}
      />

      <CartButton 
        onPress={() => navigation.navigate('Cart')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  categories: {
    height: 50,
    marginBottom: 10
  }
});