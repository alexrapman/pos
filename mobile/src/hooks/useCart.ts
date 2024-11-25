// mobile/src/hooks/useCart.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find(i => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map(i => 
            i.id === item.id 
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        };
      }
      return {
        items: [...state.items, { ...item, quantity: 1 }]
      };
    });
    saveCartToStorage(get().items);
  },

  updateQuantity: (id, quantity) => {
    set((state) => ({
      items: quantity > 0
        ? state.items.map(i => 
            i.id === id ? { ...i, quantity } : i
          )
        : state.items.filter(i => i.id !== id)
    }));
    saveCartToStorage(get().items);
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter(i => i.id !== id)
    }));
    saveCartToStorage(get().items);
  },

  clearCart: () => {
    set({ items: [] });
    AsyncStorage.removeItem('@cart');
  },

  get total() {
    return get().items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );
  }
}));

const saveCartToStorage = async (items: CartItem[]) => {
  try {
    await AsyncStorage.setItem('@cart', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

// Initialize cart from storage
const initializeCart = async () => {
  try {
    const storedCart = await AsyncStorage.getItem('@cart');
    if (storedCart) {
      useCart.setState({ items: JSON.parse(storedCart) });
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
};

initializeCart();