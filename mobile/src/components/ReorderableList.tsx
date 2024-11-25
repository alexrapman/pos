// mobile/src/components/ReorderableList.tsx
import React from 'react';
import { View } from 'react-native';
import { AnimatedListItem } from './AnimatedListItem';
import { useListReorder } from '../hooks/useListReorder';

interface ReorderableListProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
  onReorder?: (newItems: T[]) => void;
}

export function ReorderableList<T>({ 
  data, 
  renderItem, 
  keyExtractor,
  onReorder 
}: ReorderableListProps<T>) {
  const { items, handleReorder } = useListReorder(data);

  React.useEffect(() => {
    onReorder?.(items);
  }, [items, onReorder]);

  return (
    <View>
      {items.map((item, index) => (
        <AnimatedListItem
          key={keyExtractor(item)}
          index={index}
          onReorder={(direction) => handleReorder(index, direction)}
        >
          {renderItem(item)}
        </AnimatedListItem>
      ))}
    </View>
  );
}