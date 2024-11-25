// src/__tests__/context/ToastContext.test.tsx
import React from 'react';
import { render, act, screen, waitFor } from '@testing-library/react';
import { ToastProvider, ToastContext } from '../../context/ToastContext';
import { useToast } from '../../hooks/useToast';

describe('ToastContext', () => {
    const TestComponent = () => {
        const toast = useToast();
        return (
            <div>
                <button onClick={() => toast.success('Éxito')}>
                    Mostrar éxito
                </button>
                <button onClick={() => toast.error('Error')}>
                    Mostrar error
                </button>
            </div>
        );
    };

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    test('debe mostrar y eliminar notificaciones correctamente', async () => {
        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        // Mostrar notificación
        act(() => {
            screen.getByText('Mostrar éxito').click();
        });

        expect(screen.getByText('Éxito')).toBeInTheDocument();

        // Esperar que se elimine automáticamente
        act(() => {
            jest.advanceTimersByTime(5000);
        });

        await waitFor(() => {
            expect(screen.queryByText('Éxito')).not.toBeInTheDocument();
        });
    });

    test('debe mantener notificaciones de error hasta que se cierren manualmente', () => {
        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        act(() => {
            screen.getByText('Mostrar error').click();
        });

        const errorToast = screen.getByText('Error');
        expect(errorToast).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(10000);
        });

        expect(errorToast).toBeInTheDocument();
    });

    test('debe respetar el límite máximo de notificaciones', () => {
        const TestMultipleToasts = () => {
            const toast = useToast();
            return (
                <button onClick={() => {
                    toast.info('1');
                    toast.info('2');
                    toast.info('3');
                    toast.info('4');
                }}>
                    Mostrar múltiples
                </button>
            );
        };

        render(
            <ToastProvider>
                <TestMultipleToasts />
            </ToastProvider>
        );

        act(() => {
            screen.getByText('Mostrar múltiples').click();
        });

        const toasts = screen.getAllByText(/[1-4]/);
        expect(toasts).toHaveLength(3);
    });
});