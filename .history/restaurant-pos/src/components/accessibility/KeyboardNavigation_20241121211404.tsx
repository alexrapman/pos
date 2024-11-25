// src/components/accessibility/KeyboardNavigation.tsx
import React, { useEffect } from 'react';

export const KeyboardNavigation: React.FC = () => {
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Alt + N: Nueva notificación
            if (e.altKey && e.key === 'n') {
                window.electron.showNotificationDialog();
            }
            // Alt + C: Cerrar todas las notificaciones
            if (e.altKey && e.key === 'c') {
                window.electron.clearAllNotifications();
            }
            // Alt + M: Marcar todas como leídas
            if (e.altKey && e.key === 'm') {
                window.electron.markAllAsRead();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    return null;
};