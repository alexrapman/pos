// frontend/src/services/NotificationManager.ts
import { AlertThresholds } from '../config/alertThresholds';
import { BehaviorSubject } from 'rxjs';

interface Notification {
  id: string;
  level: typeof AlertThresholds[keyof typeof AlertThresholds];
  message: string;
  timestamp: number;
  groupId?: string;
  persistent?: boolean;
}

export class NotificationManager {
  private static instance: NotificationManager;
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private maxNotifications = 5;

  static getInstance(): NotificationManager {
    if (!this.instance) {
      this.instance = new NotificationManager();
    }
    return this.instance;
  }

  addNotification(
    level: typeof AlertThresholds[keyof typeof AlertThresholds],
    message: string,
    options: { groupId?: string; persistent?: boolean } = {}
  ) {
    const notification: Notification = {
      id: crypto.randomUUID(),
      level,
      message,
      timestamp: Date.now(),
      ...options
    };

    const currentNotifications = this.notifications$.value;
    
    // Group similar notifications
    if (notification.groupId) {
      const existingIndex = currentNotifications.findIndex(
        n => n.groupId === notification.groupId
      );
      if (existingIndex !== -1) {
        currentNotifications.splice(existingIndex, 1);
      }
    }

    // Maintain max notifications limit
    const updatedNotifications = [
      notification,
      ...currentNotifications
    ].slice(0, this.maxNotifications);

    this.notifications$.next(updatedNotifications);

    // Store persistent notifications
    if (notification.persistent) {
      this.storePersistentNotification(notification);
    }
  }

  removeNotification(id: string) {
    const updatedNotifications = this.notifications$.value
      .filter(n => n.id !== id);
    this.notifications$.next(updatedNotifications);
  }

  getNotifications$() {
    return this.notifications$.asObservable();
  }

  private async storePersistentNotification(notification: Notification) {
    try {
      const stored = await localStorage.getItem('persistent_notifications');
      const notifications = stored ? JSON.parse(stored) : [];
      notifications.push(notification);
      await localStorage.setItem(
        'persistent_notifications',
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error('Failed to store notification:', error);
    }
  }
}