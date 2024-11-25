// src/context/ToastContext.tsx
import React, { createContext, useReducer, useCallback } from 'react';

interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    options?: ToastOptions;
}

interface ToastOptions {
    duration?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    theme?: 'light' | 'dark';
}

interface ToastState {
    toasts: Toast[];
    config: {
        maxToasts: number;
        defaultPosition: ToastOptions['position'];
        defaultTheme: ToastOptions['theme'];
    };
}

type ToastAction =
    | { type: 'ADD_TOAST'; payload: Toast }
    | { type: 'REMOVE_TOAST'; payload: string }
    | { type: 'REMOVE_ALL' }
    | { type: 'UPDATE_CONFIG'; payload: Partial<ToastState['config']> };

const initialState: ToastState = {
    toasts: [],
    config: {
        maxToasts: 3,
        defaultPosition: 'bottom-right',
        defaultTheme: 'light'
    }
};

export const ToastContext = createContext<{
    state: ToastState;
    show: (type: Toast['type'], message: string, options?: ToastOptions) => void;
    dismiss: (id?: string) => void;
    dismissAll: () => void;
    updateConfig: (config: Partial<ToastState['config']>) => void;
} | null>(null);

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
    switch (action.type) {
        case 'ADD_TOAST':
            return {
                ...state,
                toasts: [
                    ...state.toasts.slice(-state.config.maxToasts + 1),
                    action.payload
                ]
            };
        case 'REMOVE_TOAST':
            return {
                ...state,
                toasts: state.toasts.filter(t => t.id !== action.payload)
            };
        case 'REMOVE_ALL':
            return {
                ...state,
                toasts: []
            };
        case 'UPDATE_CONFIG':
            return {
                ...state,
                config: { ...state.config, ...action.payload }
            };
        default:
            return state;
    }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(toastReducer, initialState);

    const show = useCallback((
        type: Toast['type'],
        message: string,
        options?: ToastOptions
    ) => {
        const id = crypto.randomUUID();
        dispatch({
            type: 'ADD_TOAST',
            payload: { id, type, message, options }
        });

        if (options?.duration !== 0) {
            setTimeout(() => {
                dispatch({ type: 'REMOVE_TOAST', payload: id });
            }, options?.duration || 5000);
        }
    }, []);

    const dismiss = useCallback((id?: string) => {
        if (id) {
            dispatch({ type: 'REMOVE_TOAST', payload: id });
        }
    }, []);

    const dismissAll = useCallback(() => {
        dispatch({ type: 'REMOVE_ALL' });
    }, []);

    const updateConfig = useCallback((config: Partial<ToastState['config']>) => {
        dispatch({ type: 'UPDATE_CONFIG', payload: config });
    }, []);

    return (
        <ToastContext.Provider value={{ state, show, dismiss, dismissAll, updateConfig }}>
            {children}
        </ToastContext.Provider>
    );
};