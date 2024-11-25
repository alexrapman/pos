// mobile/src/components/ErrorMessage.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Icon } from './Icon';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  severity?: 'error' | 'warning';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  severity = 'error'
}) => {
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container,
        styles[severity],
        { opacity }
      ]}
    >
      <View style={styles.content}>
        <Icon 
          name={severity === 'error' ? 'error' : 'warning'} 
          size={24} 
          color={severity === 'error' ? '#dc3545' : '#ffc107'} 
        />
        <Text style={styles.message}>{message}</Text>
      </View>

      {onRetry && (
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={onRetry}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  error: {
    backgroundColor: '#fff5f5',
    borderColor: '#dc3545',
    borderWidth: 1,
  },
  warning: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  message: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  retryButton: {
    marginLeft: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  }
});