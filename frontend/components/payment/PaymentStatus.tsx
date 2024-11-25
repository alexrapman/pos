// frontend/components/payment/PaymentStatus.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentStatusProps {
    status: 'processing' | 'success' | 'error';
    amount: number;
    orderId: string;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({
    status,
    amount,
    orderId
}) => {
    const statusConfig = {
        processing: {
            icon: '⏳',
            text: 'Procesando pago...',
            color: 'bg-blue-100 text-blue-800'
        },
        success: {
            icon: '✅',
            text: '¡Pago completado!',
            color: 'bg-green-100 text-green-800'
        },
        error: {
            icon: '❌',
            text: 'Error en el pago',
            color: 'bg-red-100 text-red-800'
        }
    };

    const config = statusConfig[status];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 rounded-lg ${config.color}`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">{config.icon}</span>
                        <span className="font-medium">{config.text}</span>
                    </div>
                    <div className="text-right">
                        <div className="font-bold">{amount.toFixed(2)}€</div>
                        <div className="text-sm">Pedido #{orderId}</div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};