// src/components/toast/ToastContainer.tsx
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CustomToast } from './CustomToast';

interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

interface ToastContainerProps {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    maxToasts?: number;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
    position = 'bottom-right',
    maxToasts = 3
}) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const positionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4'
    };

    useEffect(() => {
        const handleNewToast = (toast: Toast) => {
            setToasts(prev => {
                const filtered = prev.length >= maxToasts
                    ? prev.slice(1)
                    : prev;
                return [...filtered, toast];
            });

            // Auto-remove success toasts after 5 seconds
            if (toast.type === 'success') {
                setTimeout(() => {
                    removeToast(toast.id);
                }, 5000);
            }
        };

        window.electron.toastService.on('new-toast', handleNewToast);
        return () => {
            window.electron.toastService.off('new-toast', handleNewToast);
        };
    }, [maxToasts]);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <div
            className={`
                fixed z-50 flex flex-col gap-2
                ${positionClasses[position]}
            `}
            style={{
                pointerEvents: 'none'
            }}
        >
            <AnimatePresence>
                {toasts.map(toast => (
                    <motion.div
                        key={toast.id}
                        layout
                        style={{ pointerEvents: 'auto' }}
                    >
                        <CustomToast
                            type={toast.type}
                            message={toast.message}
                            onClose={() => removeToast(toast.id)}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};