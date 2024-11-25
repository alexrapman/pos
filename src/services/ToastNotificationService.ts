// src/services/ToastNotificationService.ts
import { toast, ToastOptions } from 'react-toastify';
import { EventEmitter } from 'events';

interface ToastConfig {
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    theme: 'light' | 'dark';
    autoClose: number;
    maxToasts: number;
}

export class ToastNotificationService extends EventEmitter {
    private config: ToastConfig = {
        position: 'bottom-right',
        theme: 'light',
        autoClose: 5000,
        maxToasts: 3
    };

    private activeToasts: Set<string> = new Set();

    showSuccess(message: string, options?: Partial<ToastOptions>) {
        this.showToast('success', message, options);
    }

    showError(message: string, options?: Partial<ToastOptions>) {
        this.showToast('error', message, {
            ...options,
            autoClose: false // Errores no se cierran automáticamente
        });
    }

    showWarning(message: string, options?: Partial<ToastOptions>) {
        this.showToast('warning', message, options);
    }

    showInfo(message: string, options?: Partial<ToastOptions>) {
        this.showToast('info', message, options);
    }

    private showToast(type: 'success' | 'error' | 'warning' | 'info', message: string, options?: Partial<ToastOptions>) {
        if (this.activeToasts.size >= this.config.maxToasts) {
            toast.dismiss(Array.from(this.activeToasts)[0]);
        }

        const toastId = toast[type](message, {
            position: this.config.position,
            theme: this.config.theme,
            autoClose: this.config.autoClose,
            ...options,
            onOpen: () => {
                this.activeToasts.add(toastId);
                this.emit('toast-show', { id: toastId, type, message });
            },
            onClose: () => {
                this.activeToasts.delete(toastId);
                this.emit('toast-hide', toastId);
            }
        });
    }

    configure(newConfig: Partial<ToastConfig>): void {
        this.config = { ...this.config, ...newConfig };
    }

    dismissAll(): void {
        toast.dismiss();
        this.activeToasts.clear();
    }
}