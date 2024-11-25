// mobile/src/services/PushNotificationService.ts
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

export class PushNotificationService {
  async requestPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  async getToken() {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  }

  async subscribeToTopic(topic: string) {
    await messaging().subscribeToTopic(topic);
    console.log(`Subscribed to topic: ${topic}`);
  }

  async unsubscribeFromTopic(topic: string) {
    await messaging().unsubscribeFromTopic(topic);
    console.log(`Unsubscribed from topic: ${topic}`);
  }

  onMessage(callback: (message: any) => void) {
    return messaging().onMessage(callback);
  }

  onNotificationOpened(callback: (message: any) => void) {
    return messaging().onNotificationOpenedApp(callback);
  }

  onBackgroundMessage(callback: (message: any) => void) {
    if (Platform.OS === 'android') {
      messaging().setBackgroundMessageHandler(callback);
    }
  }
}