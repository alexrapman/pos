// src/hooks/useToast.ts
import { useContext, useCallback } from 'react';
import { ToastContext } from '../context/ToastContext';

export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    const showToast = useCallback((options: {
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
        duration?: number;
    }) => {
        context.addToast(options);
    }, [context]);

    const toast = {
        success: (message: string, duration?: number) =>
            showToast({ type: 'success', message, duration }),
        error: (message: string, duration?: number) =>
            showToast({ type: 'error', message, duration }),
        warning: (message: string, duration?: number) =>
            showToast({ type: 'warning', message, duration }),
        info: (message: string, duration?: number) =>
            showToast({ type: 'info', message, duration })
    };

    return { toast, showToast };
};