// frontend/src/components/alerts/NotificationContainer.tsx
import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { NotificationManager } from '../../services/NotificationManager';
import { AlertNotification } from './AlertNotification';

export const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const notificationManager = NotificationManager.getInstance();

  useEffect(() => {
    const subscription = notificationManager
      .getNotifications$()
      .subscribe(newNotifications => {
        setNotifications(newNotifications);
      });

    return () => subscription.unsubscribe();
  }, []);

  const handleDismiss = (id: string) => {
    notificationManager.removeNotification(id);
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-96 space-y-2">
      <AnimatePresence>
        {notifications.map(notification => (
          <AlertNotification
            key={notification.id}
            level={notification.level}
            message={notification.message}
            duration={notification.persistent ? undefined : 5000}
            onDismiss={() => handleDismiss(notification.id)}
          />
        ))}
      </AnimatePresence>
      
      {/* Group counter for similar notifications */}
      {notifications.some(n => n.groupId) && (
        <div className="text-sm text-gray-500 text-right">
          {Object.entries(
            notifications.reduce((acc, n) => {
              if (n.groupId) {
                acc[n.groupId] = (acc[n.groupId] || 0) + 1;
              }
              return acc;
            }, {} as Record<string, number>)
          ).map(([groupId, count]) => (
            <div key={groupId}>
              {count} similar notifications
            </div>
          ))}
        </div>
      )}
    </div>
  );
};