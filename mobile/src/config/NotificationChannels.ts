// mobile/src/config/NotificationChannels.ts
import PushNotification, { Importance } from 'react-native-push-notification';

export class NotificationChannels {
  static initialize() {
    // Order related notifications
    PushNotification.createChannel(
      {
        channelId: 'orders',
        channelName: 'Order Updates',
        channelDescription: 'Notifications about your order status',
        playSound: true,
        soundName: 'order_update.mp3',
        importance: Importance.HIGH,
        vibrate: true
      },
      (created) => console.log(`Orders channel created: ${created}`)
    );

    // Special offers and promotions
    PushNotification.createChannel(
      {
        channelId: 'offers',
        channelName: 'Special Offers',
        channelDescription: 'Notifications about special offers and promotions',
        playSound: true,
        soundName: 'special_offer.mp3',
        importance: Importance.DEFAULT,
        vibrate: true
      },
      (created) => console.log(`Offers channel created: ${created}`)
    );

    // System notifications
    PushNotification.createChannel(
      {
        channelId: 'system',
        channelName: 'System Updates',
        channelDescription: 'Important system notifications',
        playSound: true,
        soundName: 'system_notification.mp3',
        importance: Importance.LOW,
        vibrate: false
      },
      (created) => console.log(`System channel created: ${created}`)
    );
  }

  static getChannelId(type: string): string {
    switch (type) {
      case 'ORDER_STATUS':
        return 'orders';
      case 'SPECIAL_OFFER':
        return 'offers';
      default:
        return 'system';
    }
  }
}