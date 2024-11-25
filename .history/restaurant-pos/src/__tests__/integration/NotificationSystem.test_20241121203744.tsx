// src/__tests__/integration/NotificationSystem.test.tsx
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { ToastProvider } from '../../context/ToastContext';
import { NotificationSystem } from '../../components/notifications/NotificationSystem';
import { WindowsNotificationService } from '../../services/WindowsNotificationService';

describe('Sistema de Notificaciones - Tests de Integración', () => {
    let notificationService: WindowsNotificationService;

    beforeEach(() => {
        notificationService = new WindowsNotificationService();
        jest.spyOn(window.electron, 'showNotification');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('debe mostrar notificaciones del sistema y en la UI', async () => {
        const { getByText } = render(
            <ToastProvider>
                <NotificationSystem />
            </ToastProvider>
        );

        act(() => {
            notificationService.notify('test', {
                title: 'Prueba',
                message: 'Mensaje de prueba'
            });
        });

        expect(getByText('Mensaje de prueba')).toBeInTheDocument();
        expect(window.electron.showNotification).toHaveBeenCalledWith(
            'Prueba',
            'Mensaje de prueba'
        );
    });

    test('debe gestionar múltiples notificaciones concurrentes', async () => {
        const { getAllByRole } = render(
            <ToastProvider>
                <NotificationSystem />
            </ToastProvider>
        );

        act(() => {
            for (let i = 0; i < 5; i++) {
                notificationService.notify('test', {
                    title: `Notificación ${i}`,
                    message: `Mensaje ${i}`
                });
            }
        });

        const notifications = getAllByRole('alert');
        expect(notifications).toHaveLength(3); // Máximo configurado
    });

    test('debe persistir notificaciones críticas', async () => {
        const { getByText } = render(
            <ToastProvider>
                <NotificationSystem />
            </ToastProvider>
        );

        act(() => {
            notificationService.notify('critical', {
                title: 'Error Crítico',
                message: 'Error del sistema',
                persistent: true
            });
        });

        await act(async () => {
            jest.advanceTimersByTime(10000);
        });

        expect(getByText('Error del sistema')).toBeInTheDocument();
    });

    test('debe manejar interacciones del usuario', async () => {
        const { getByText, queryByText } = render(
            <ToastProvider>
                <NotificationSystem />
            </ToastProvider>
        );

        act(() => {
            notificationService.notify('info', {
                title: 'Info',
                message: 'Mensaje informativo'
            });
        });

        const closeButton = getByText('×');
        fireEvent.click(closeButton);

        expect(queryByText('Mensaje informativo')).not.toBeInTheDocument();
    });
});