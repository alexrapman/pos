// frontend/components/kitchen/OrderCard.tsx 
import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Order } from '../../types';

interface OrderCardProps {
    order: Order;
    onUpdateStatus: (orderId: string, status: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdateStatus }) => {
    const [elapsedTime, setElapsedTime] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(
                formatDistanceToNow(new Date(order.createdAt), {
                    locale: es,
                    addSuffix: true
                })
            );
        }, 1000);

        return () => clearInterval(timer);
    }, [order.createdAt]);

    const getNextStatus = (currentStatus: string) => {
        const flow = {
            'pending': 'preparing',
            'preparing': 'ready',
            'ready': 'served'
        };
        return flow[currentStatus as keyof typeof flow];
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Mesa {order.tableNumber}</span>
                <span className="text-sm text-gray-500">{elapsedTime}</span>
            </div>

            <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        {item.notes && (
                            <span className="text-sm text-red-500">
                                {item.notes}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {getNextStatus(order.status) && (
                <button
                    onClick={() => onUpdateStatus(order.id, getNextStatus(order.status))}
                    className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Marcar como {getNextStatus(order.status)}
                </button>
            )}
        </div>
    );
};