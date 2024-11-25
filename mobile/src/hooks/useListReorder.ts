// mobile/src/hooks/useListReorder.ts
import { useState, useCallback } from 'react';
import { LayoutAnimation } from 'react-native';

export const useListReorder = <T>(initialItems: T[]) => {
  const [items, setItems] = useState<T[]>(initialItems);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    setItems(currentItems => {
      const newItems = [...currentItems];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      return newItems;
    });
  }, []);

  const handleReorder = useCallback((index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      moveItem(index, index - 1);
    } else if (direction === 'down' && index < items.length - 1) {
      moveItem(index, index + 1);
    }
  }, [items.length, moveItem]);

  return {
    items,
    setItems,
    handleReorder,
    moveItem
  };
};