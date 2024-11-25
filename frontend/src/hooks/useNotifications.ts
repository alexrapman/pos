// frontend/src/hooks/useNotifications.ts
import { useEffect, useCallback } from 'react';
import { NotificationManager } from '../services/NotificationManager';
import { AlertThresholds } from '../config/alertThresholds';

export const useNotifications = () => {
  const notificationManager = NotificationManager.getInstance();

  const notify = useCallback((
    level: typeof AlertThresholds[keyof typeof AlertThresholds],
    message: string,
    options?: { groupId?: string; persistent?: boolean }
  ) => {
    notificationManager.addNotification(level, message, options);
  }, []);

  // Convenience methods for different notification types
  const notifyError = useCallback((message: string, options?: { persistent?: boolean }) => {
    notify(AlertThresholds.CRITICAL, message, { ...options, groupId: 'errors' });
  }, [notify]);

  const notifyWarning = useCallback((message: string) => {
    notify(AlertThresholds.WARNING, message);
  }, [notify]);

  const notifyInfo = useCallback((message: string) => {
    notify(AlertThresholds.INFO, message);
  }, [notify]);

  const notifyKitchenAlert = useCallback((message: string) => {
    notify(AlertThresholds.WARNING, message, { 
      groupId: 'kitchen',
      persistent: true 
    });
  }, [notify]);

  return {
    notify,
    notifyError,
    notifyWarning, 
    notifyInfo,
    notifyKitchenAlert
  };
};

// Usage example:
const ExampleComponent: React.FC = () => {
  const { notifyWarning, notifyKitchenAlert } = useNotifications();

  useEffect(() => {
    if (orderQueueLength > 10) {
      notifyWarning('Order queue is getting long');
    }
  }, [orderQueueLength]);

  const handleSlowOrder = () => {
    notifyKitchenAlert('Order #123 is taking longer than expected');
  };

  return (
    // Component JSX
  );
};