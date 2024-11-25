// mobile/src/services/NotificationService.ts
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class NotificationService {
  async initialize() {
    await this.requestPermission();
    await this.setupFCMToken();
    this.setupMessageHandlers();
  }

  private async requestPermission() {
    const authStatus = await messaging().requestPermission();
    return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
  }

  private async setupFCMToken() {
    const token = await messaging().getToken();
    await AsyncStorage.setItem('fcmToken', token);

    messaging().onTokenRefresh(async (newToken) => {
      await AsyncStorage.setItem('fcmToken', newToken);
      await this.updateTokenOnServer(newToken);
    });
  }

  private setupMessageHandlers() {
    // Foreground messages
    messaging().onMessage(async (remoteMessage) => {
      this.handleNotification(remoteMessage);
    });

    // Background messages
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      this.handleNotification(remoteMessage);
    });
  }

  private async handleNotification(message: any) {
    const { title, body, data } = message.notification;

    switch (data.type) {
      case 'ORDER_STATUS':
        this.handleOrderStatus(data);
        break;
      case 'SPECIAL_OFFER':
        this.handleSpecialOffer(data);
        break;
    }
  }

  private async updateTokenOnServer(token: string) {
    try {
      await fetch(`${API_URL}/api/users/fcm-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('userToken')}`
        },
        body: JSON.stringify({ token })
      });
    } catch (error) {
      console.error('Failed to update FCM token:', error);
    }
  }
}