// mobile/src/managers/PermissionManager.ts
import messaging from '@react-native-firebase/messaging';
import { Platform, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class PermissionManager {
  static async checkNotificationPermissions(): Promise<boolean> {
    try {
      const hasPermission = await messaging().hasPermission();
      return hasPermission === messaging.AuthorizationStatus.AUTHORIZED;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }

  static async requestNotificationPermissions(): Promise<boolean> {
    try {
      const status = await messaging().requestPermission();
      const isGranted = status === messaging.AuthorizationStatus.AUTHORIZED;
      
      await AsyncStorage.setItem('notificationPermission', String(isGranted));
      return isGranted;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  static async handlePermissionDenied() {
    Alert.alert(
      'Notifications Disabled',
      'Enable notifications to receive order updates and special offers',
      [
        {
          text: 'Settings',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          }
        },
        {
          text: 'Later',
          style: 'cancel'
        }
      ]
    );
  }

  static async checkAndRequestPermissions() {
    const hasPermission = await this.checkNotificationPermissions();
    
    if (!hasPermission) {
      const wasGranted = await this.requestNotificationPermissions();
      if (!wasGranted) {
        const neverAskAgain = await AsyncStorage.getItem('neverAskAgain');
        if (neverAskAgain !== 'true') {
          this.handlePermissionDenied();
        }
      }
    }
    
    return hasPermission;
  }
}