// mobile/src/components/boundaries/NotificationErrorBoundary.tsx
import React from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { View, Text, StyleSheet } from 'react-native';
import { PermissionManager } from '../../managers/PermissionManager';

export const NotificationErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const handleRecovery = async () => {
    await PermissionManager.checkAndRequestPermissions();
  };

  return (
    <ErrorBoundary
      fallback={
        <View style={styles.container}>
          <Text style={styles.title}>Notification Error</Text>
          <Text style={styles.message}>
            There was a problem with notifications. Please check your settings.
          </Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleRecovery}
          >
            <Text style={styles.buttonText}>Check Permissions</Text>
          </TouchableOpacity>
        </View>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

// Usage in NotificationSettingsScreen.tsx
export const NotificationSettingsScreen = () => {
  return (
    <NotificationErrorBoundary>
      <View style={styles.container}>
        {/* Previous notification settings implementation */}
      </View>
    </NotificationErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  }
});