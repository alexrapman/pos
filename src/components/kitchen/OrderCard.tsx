// src/components/kitchen/OrderCard.tsx
import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Order, OrderStatus } from '../../models/Order';
import { OrderTimer } from './OrderTimer';
import { CookingInstructions } from './CookingInstructions';

interface OrderCardProps {
    order: Order;
    onStatusChange: (status: OrderStatus) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusChange }) => {
    const [elapsedTime, setElapsedTime] = useState('');
    const [isPriority, setIsPriority] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const elapsed = formatDistanceToNow(new Date(order.createdAt));
            setElapsedTime(elapsed);

            // Mark as priority if waiting more than 15 minutes
            const waitTime = Date.now() - new Date(order.createdAt).getTime();
            setIsPriority(waitTime > 15 * 60 * 1000);
        }, 1000);

        return () => clearInterval(timer);
    }, [order.createdAt]);

    const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
        const statusFlow = {
            [OrderStatus.PENDING]: OrderStatus.PREPARING,
            [OrderStatus.PREPARING]: OrderStatus.READY,
            [OrderStatus.READY]: OrderStatus.DELIVERED,
            [OrderStatus.DELIVERED]: null
        };
        return statusFlow[currentStatus];
    };

    return (
        <div className={`
            border rounded-lg p-4
            ${isPriority ? 'border-red-500 bg-red-50' : 'border-gray-200'}
        `}>
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Table {order.tableNumber}</span>
                <span className="text-sm text-gray-500">{elapsedTime} ago</span>
            </div>

            <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        {item.notes && (
                            <span className="text-sm text-gray-600">{item.notes}</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center">
                <span className={`
                    px-2 py-1 rounded text-sm
                    ${isPriority ? 'bg-red-100 text-red-800' : 'bg-gray-100'}
                `}>
                    {order.status}
                </span>
                {getNextStatus(order.status) && (
                    <button
                        onClick={() => onStatusChange(getNextStatus(order.status)!)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Mark as {getNextStatus(order.status)}
                    </button>
                )}
            </div>

            <div className="flex justify-between items-center">
                <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="text-sm text-blue-600 hover:underline"
                >
                    {showInstructions ? 'Hide' : 'Show'} Instructions
                </button>
                <span className="text-sm text-gray-500">
                    {elapsedTime} ago
                </span>
            </div>

            {showInstructions && (
                <CookingInstructions items={order.items} />
            )}
        </div>
    );
};