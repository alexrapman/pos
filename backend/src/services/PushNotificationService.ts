// backend/src/services/PushNotificationService.ts
import webpush from 'web-push';
import { User } from '../models/User';

export class PushNotificationService {
  constructor() {
    webpush.setVapidDetails(
      'mailto:admin@example.com',
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    );
  }

  async sendNotification(userId: number, payload: any) {
    const user = await User.findByPk(userId);
    if (!user || !user.pushSubscription) return;

    const subscription = JSON.parse(user.pushSubscription);
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  }

  async sendNotificationToRole(role: string, payload: any) {
    const users = await User.findAll({ where: { role } });
    const notifications = users.map(user => {
      if (!user.pushSubscription) return;
      const subscription = JSON.parse(user.pushSubscription);
      return webpush.sendNotification(subscription, JSON.stringify(payload));
    });

    await Promise.all(notifications);
  }
}