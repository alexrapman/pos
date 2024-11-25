// src/components/toast/ToastContainer.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toast } from '../../context/ToastContext';
import { FiX, FiCheck, FiInfo, FiAlertTriangle } from 'react-icons/fi';

interface ToastContainerProps {
    toasts: Toast[];
    removeToast: (id: string) => void;
}

const toastTypeConfig = {
    success: {
        icon: FiCheck,
        className: 'bg-green-500 text-white'
    },
    error: {
        icon: FiX,
        className: 'bg-red-500 text-white'
    },
    warning: {
        icon: FiAlertTriangle,
        className: 'bg-yellow-500 text-white'
    },
    info: {
        icon: FiInfo,
        className: 'bg-blue-500 text-white'
    }
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
    return (
        <div
            className="fixed bottom-4 right-4 z-50"
            aria-live="polite"
            aria-atomic="true"
        >
            <AnimatePresence>
                {toasts.map(toast => {
                    const { icon: Icon, className } = toastTypeConfig[toast.type];

                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 50, scale: 0.3 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                            className={`
                                flex items-center gap-2 mb-2 px-4 py-2 rounded-lg shadow-lg
                                ${className}
                            `}
                            role="alert"
                        >
                            <Icon className="w-5 h-5" />
                            <span>{toast.message}</span>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="ml-2 hover:opacity-75"
                                aria-label="Close notification"
                            >
                                <FiX />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};