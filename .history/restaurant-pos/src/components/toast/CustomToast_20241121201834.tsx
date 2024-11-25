// src/components/toast/CustomToast.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

interface CustomToastProps {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onClose: () => void;
}

const toastConfig = {
    success: {
        icon: FiCheck,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-500',
        textColor: 'text-green-800',
        iconColor: 'text-green-500'
    },
    error: {
        icon: FiX,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-500',
        textColor: 'text-red-800',
        iconColor: 'text-red-500'
    },
    warning: {
        icon: FiAlertCircle,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-500',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-500'
    },
    info: {
        icon: FiInfo,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-500',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-500'
    }
};

export const CustomToast: React.FC<CustomToastProps> = ({
    type,
    message,
    onClose
}) => {
    const config = toastConfig[type];
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className={`
                flex items-center gap-3 p-4 rounded-lg border
                shadow-lg min-w-[300px] max-w-md
                ${config.bgColor}
                ${config.borderColor}
                ${config.textColor}
            `}
        >
            <div className={`text-xl ${config.iconColor}`}>
                <Icon />
            </div>

            <p className="flex-1 text-sm">{message}</p>

            <button
                onClick={onClose}
                className={`
                    p-1 rounded-full hover:bg-black hover:bg-opacity-10
                    transition-colors duration-200
                `}
            >
                <FiX className="w-4 h-4" />
            </button>
        </motion.div>
    );
};