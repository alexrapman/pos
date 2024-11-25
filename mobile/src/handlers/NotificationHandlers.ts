// mobile/src/handlers/NotificationHandlers.ts
import { NavigationService } from '../services/NavigationService';
import PushNotification from 'react-native-push-notification';
import { store } from '../store';
import { updateOrder } from '../store/orderSlice';

export class NotificationHandlers {
  private static queue: any[] = [];
  private static isProcessing = false;

  static async handleOrderStatus(data: any) {
    const { orderId, status, message } = data;
    
    // Update store
    store.dispatch(updateOrder({ orderId, status }));

    // Show local notification
    PushNotification.localNotification({
      channelId: 'orders',
      title: 'Order Update',
      message,
      data: { orderId, type: 'ORDER_STATUS' }
    });

    // Navigate if app is active
    if (store.getState().app.isActive) {
      NavigationService.navigate('OrderDetails', { orderId });
    }
  }

  static async handleSpecialOffer(data: any) {
    const { offerId, title, description } = data;

    // Add to queue
    this.queue.push({
      type: 'SPECIAL_OFFER',
      data: { offerId, title, description }
    });

    // Process queue
    this.processQueue();
  }

  private static async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const notification = this.queue.shift();
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Delay between notifications

      PushNotification.localNotification({
        channelId: 'offers',
        title: notification.data.title,
        message: notification.data.description,
        data: { type: notification.type, ...notification.data }
      });
    }

    this.isProcessing = false;
  }

  static async handleNotificationPress(notification: any) {
    const { type, ...data } = notification.data;

    switch (type) {
      case 'ORDER_STATUS':
        NavigationService.navigate('OrderDetails', { orderId: data.orderId });
        break;
      case 'SPECIAL_OFFER':
        NavigationService.navigate('OfferDetails', { offerId: data.offerId });
        break;
    }
  }
}