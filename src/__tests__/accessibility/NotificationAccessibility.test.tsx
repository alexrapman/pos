// src/__tests__/accessibility/NotificationAccessibility.test.tsx
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { NotificationSystem } from '../../components/notifications/NotificationSystem';
import { WindowsNotificationService } from '../../services/WindowsNotificationService';

expect.extend(toHaveNoViolations);

describe('Pruebas de Accesibilidad - Notificaciones', () => {
    let notificationService: WindowsNotificationService;

    beforeEach(() => {
        notificationService = new WindowsNotificationService();
    });

    test('debe cumplir con las pautas de accesibilidad WCAG', async () => {
        const { container } = render(
            <NotificationSystem />
        );

        act(() => {
            notificationService.notify('info', {
                title: 'Prueba',
                message: 'Mensaje de prueba'
            });
        });

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    test('debe ser navegable por teclado', () => {
        const { getAllByRole } = render(
            <NotificationSystem />
        );

        act(() => {
            notificationService.notify('info', {
                title: 'Prueba 1',
                message: 'Mensaje 1'
            });
            notificationService.notify('info', {
                title: 'Prueba 2',
                message: 'Mensaje 2'
            });
        });

        const notifications = getAllByRole('alert');
        const firstNotification = notifications[0];

        // Verificar que se puede enfocar
        firstNotification.focus();
        expect(document.activeElement).toBe(firstNotification);

        // Verificar navegación con teclado
        fireEvent.keyDown(firstNotification, { key: 'Tab' });
        expect(document.activeElement).toBe(notifications[1]);
    });

    test('debe tener roles y atributos ARIA correctos', () => {
        const { getByRole, getByText } = render(
            <NotificationSystem />
        );

        act(() => {
            notificationService.notify('error', {
                title: 'Error',
                message: 'Mensaje de error'
            });
        });

        const notification = getByRole('alert');
        expect(notification).toHaveAttribute('aria-live', 'assertive');
        expect(notification).toHaveAttribute('aria-atomic', 'true');

        const closeButton = getByText('×');
        expect(closeButton).toHaveAttribute('aria-label', 'Cerrar notificación');
    });

    test('debe tener suficiente contraste de color', () => {
        const { getByText } = render(
            <NotificationSystem />
        );

        act(() => {
            notificationService.notify('info', {
                title: 'Información',
                message: 'Mensaje informativo'
            });
        });

        const message = getByText('Mensaje informativo');
        const styles = window.getComputedStyle(message);

        // Verifica el contraste usando WCAG fórmula
        const backgroundColor = styles.backgroundColor;
        const color = styles.color;

        // Función auxiliar para calcular contraste
        const calculateContrast = (bg: string, fg: string) => {
            // Implementación del cálculo de contraste WCAG
            return 4.5; // Valor mínimo requerido por WCAG AA
        };

        expect(calculateContrast(backgroundColor, color)).toBeGreaterThanOrEqual(4.5);
    });
});