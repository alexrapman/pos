// frontend/hooks/usePaymentStatus.ts
import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';

export const usePaymentStatus = (orderId: string) => {
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const socket = useSocket();

    useEffect(() => {
        socket.on('order-paid', (data) => {
            if (data.orderId === orderId) {
                setStatus('success');
            }
        });

        socket.on('payment-failed', (data) => {
            if (data.orderId === orderId) {
                setStatus('error');
            }
        });

        return () => {
            socket.off('order-paid');
            socket.off('payment-failed');
        };
    }, [orderId, socket]);

    return status;
};