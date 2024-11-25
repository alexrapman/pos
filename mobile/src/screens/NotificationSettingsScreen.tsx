// mobile/src/screens/NotificationSettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Switch } from '../components/Switch';
import { useNotificationPreferences } from '../hooks/useNotificationPreferences';

export const NotificationSettingsScreen = () => {
  const { preferences, loading, updatePreference, resetPreferences } = useNotificationPreferences();

  const syncPreferencesWithServer = async (key: string, value: boolean) => {
    try {
      await fetch(`${API_URL}/api/notifications/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`
        },
        body: JSON.stringify({ [key]: value })
      });
    } catch (error) {
      console.error('Failed to sync preferences:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Order Updates</Text>
          <Switch
            value={preferences.orders}
            onValueChange={async (value) => {
              await updatePreference('orders', value);
              await syncPreferencesWithServer('orders', value);
            }}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Special Offers</Text>
          <Switch
            value={preferences.offers}
            onValueChange={async (value) => {
              await updatePreference('offers', value);
              await syncPreferencesWithServer('offers', value);
            }}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>System Updates</Text>
          <Switch
            value={preferences.system}
            onValueChange={async (value) => {
              await updatePreference('system', value);
              await syncPreferencesWithServer('system', value);
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    padding: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12
  },
  settingLabel: {
    fontSize: 16
  }
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNotificationPreferences } from '../hooks/useNotificationPreferences';
import { useErrorTracking } from '../hooks/useErrorTracking';
import { Switch } from '../components/Switch';
import { ErrorMessage } from '../components/ErrorMessage';

export const NotificationSettingsScreen = () => {
  const { preferences, loading, updatePreference } = useNotificationPreferences();
  const { isError, errorMessage, trackError } = useErrorTracking({
    retryCount: 3,
    context: { screen: 'NotificationSettings' }
  });

  const handleToggle = async (key: string, value: boolean) => {
    try {
      await trackError(
        async () => await updatePreference(key, value),
        { action: 'togglePreference', preferenceKey: key }
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to update preference. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      {isError && (
        <ErrorMessage
          message={errorMessage || 'An error occurred'}
          onRetry={() => handleToggle('orders', !preferences.orders)}
        />
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Preferences</Text>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Order Updates</Text>
          <Switch
            value={preferences.orders}
            onValueChange={(value) => handleToggle('orders', value)}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Special Offers</Text>
          <Switch
            value={preferences.offers}
            onValueChange={(value) => handleToggle('offers', value)}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>System Updates</Text>
          <Switch
            value={preferences.system}
            onValueChange={(value) => handleToggle('system', value)}
          />
        </View>
      </View>
    </ScrollView>
  );
};
