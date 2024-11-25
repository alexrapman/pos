// mobile/src/hooks/useNotificationPreferences.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationPreference {
  orders: boolean;
  offers: boolean;
  system: boolean;
}

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useState<NotificationPreference>({
    orders: true,
    offers: true,
    system: true
  };

  const updatePreference = async (key: keyof NotificationPreference, value: boolean) => {
    try {
      await withRetry(async () => {
        const newPreferences = { ...preferences, [key]: value };

        // Sync with server first
        await fetch(`${API_URL}/api/notifications/preferences`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`
          },
          body: JSON.stringify({ [key]: value })
        });

        // If server sync successful, update local storage
        await AsyncStorage.setItem('notificationPreferences', JSON.stringify(newPreferences));
        setPreferences(newPreferences);
      }, {
        maxAttempts: 3,
        initialDelay: 1000
      });
    } catch (error) {
      // Revert local state if server sync fails
      Alert.alert(
        'Error',
        'Failed to update notification preferences. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem('notificationPreferences');
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (key: keyof NotificationPreference, value: boolean) => {
    try {
      const newPreferences = { ...preferences, [key]: value };
      await AsyncStorage.setItem('notificationPreferences', JSON.stringify(newPreferences));
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Failed to update notification preference:', error);
    }
  };

  const resetPreferences = async () => {
    const defaultPreferences: NotificationPreference = {
      orders: true,
      offers: true,
      system: true
    };
    
    try {
      await AsyncStorage.setItem('notificationPreferences', JSON.stringify(defaultPreferences));
      setPreferences(defaultPreferences);
    } catch (error) {
      console.error('Failed to reset notification preferences:', error);
    }
  };

  return {
    preferences,
    loading,
    updatePreference,
    resetPreferences
  };
};