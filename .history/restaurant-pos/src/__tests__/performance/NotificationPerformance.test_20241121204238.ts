// src/__tests__/performance/NotificationPerformance.test.ts
import { performance } from 'perf_hooks';
import { NotificationSystem } from '../../components/notifications/NotificationSystem';
import { WindowsNotificationService } from '../../services/WindowsNotificationService';

describe('Tests de Rendimiento - Sistema de Notificaciones', () => {
    let notificationService: WindowsNotificationService;

    beforeEach(() => {
        notificationService = new WindowsNotificationService();
        jest.spyOn(process, 'memoryUsage');
    });

    test('debe mantener tiempos de respuesta aceptables bajo carga', async () => {
        const iterations = 100;
        const times: number[] = [];

        for (let i = 0; i < iterations; i++) {
            const start = performance.now();

            await notificationService.notify('test', {
                title: `Test ${i}`,
                message: `Mensaje de prueba ${i}`
            });

            times.push(performance.now() - start);
        }

        const averageTime = times.reduce((a, b) => a + b) / times.length;
        expect(averageTime).toBeLessThan(16.67); // 60fps = 16.67ms por frame
    });

    test('debe gestionar eficientemente la memoria', () => {
        const initialMemory = process.memoryUsage().heapUsed;

        // Generar 1000 notificaciones
        for (let i = 0; i < 1000; i++) {
            notificationService.notify('test', {
                title: `Test ${i}`,
                message: `Mensaje largo de prueba ${i}`.repeat(100)
            });
        }

        const finalMemory = process.memoryUsage().heapUsed;
        const memoryIncrease = finalMemory - initialMemory;

        // No debe exceder 50MB de incremento
        expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });

    test('debe mantener rendimiento en animaciones concurrentes', async () => {
        const fps: number[] = [];
        let lastFrame = performance.now();

        // Simular 60 frames
        for (let i = 0; i < 60; i++) {
            // Crear 10 notificaciones animadas simultáneas
            for (let j = 0; j < 10; j++) {
                notificationService.notify('test', {
                    title: `Animation Test ${j}`,
                    message: 'Mensaje animado'
                });
            }

            const now = performance.now();
            fps.push(1000 / (now - lastFrame));
            lastFrame = now;

            await new Promise(resolve => setTimeout(resolve, 16.67));
        }

        const averageFPS = fps.reduce((a, b) => a + b) / fps.length;
        expect(averageFPS).toBeGreaterThan(30); // Mínimo 30fps
    });

    test('debe liberar recursos correctamente', async () => {
        const getActiveNotifications = () =>
            document.querySelectorAll('[role="alert"]').length;

        // Crear y eliminar 100 notificaciones
        for (let i = 0; i < 100; i++) {
            notificationService.notify('test', {
                title: `Test ${i}`,
                message: 'Mensaje temporal',
                duration: 100
            });
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        expect(getActiveNotifications()).toBe(0);
    });
});