// backend/src/__tests__/NotificationService.test.ts
import { NotificationService } from '../services/NotificationService';

describe('NotificationService', () => {
    let notificationService: NotificationService;

    beforeEach(() => {
        notificationService = new NotificationService();
    });

    test('debe crear una nueva notificación', () => {
        notificationService.createNotification('info', 'Mensaje de prueba');
        const notifications = notificationService.getNotifications();
        expect(notifications).toHaveLength(1);
        expect(notifications[0].message).toBe('Mensaje de prueba');
    });

    test('debe emitir un evento al crear una notificación', () => {
        const listener = jest.fn();
        notificationService.on('new-notification', listener);
        notificationService.createNotification('info', 'Mensaje de prueba');
        expect(listener).toHaveBeenCalled();
    });
});