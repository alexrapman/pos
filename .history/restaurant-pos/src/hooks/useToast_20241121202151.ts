// src/hooks/useToast.ts
import { useCallback, useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

interface ToastOptions {
    duration?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    theme?: 'light' | 'dark';
}

export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast debe usarse dentro de un ToastProvider');
    }

    const showToast = useCallback((
        type: 'success' | 'error' | 'warning' | 'info',
        message: string,
        options?: ToastOptions
    ) => {
        context.show(type, message, options);
    }, [context]);

    const toast = {
        success: (message: string, options?: ToastOptions) =>
            showToast('success', message, options),
        error: (message: string, options?: ToastOptions) =>
            showToast('error', message, { ...options, duration: 0 }),
        warning: (message: string, options?: ToastOptions) =>
            showToast('warning', message, options),
        info: (message: string, options?: ToastOptions) =>
            showToast('info', message, options),
        dismiss: (id?: string) => context.dismiss(id),
        dismissAll: () => context.dismissAll()
    };

    return toast;
};