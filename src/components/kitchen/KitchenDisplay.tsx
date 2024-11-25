// src/components/kitchen/KitchenDisplay.tsx
import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Order, OrderStatus } from '../../models/Order';

export const KitchenDisplay: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const { socket, connected } = useWebSocket();
    const [notification] = useState(new Audio('/sounds/new-order.mp3'));

    useEffect(() => {
        if (!socket) return;

        socket.emit('join:kitchen');

        socket.on('order:new', (order: Order) => {
            setOrders(prev => [...prev, order]);
            notification.play().catch(console.error);
        });

        socket.on('order:updated', (updatedOrder: Order) => {
            setOrders(prev => prev.map(order =>
                order.id === updatedOrder.id ? updatedOrder : order
            ));
        });

        return () => {
            socket.off('order:new');
            socket.off('order:updated');
        };
    }, [socket, notification]);

    const getOrdersByStatus = (status: OrderStatus) => {
        return orders.filter(order => order.status === status);
    };

    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            {Object.values(OrderStatus).map(status => (
                <div key={status} className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-bold mb-4">{status}</h2>
                    <div className="space-y-4">
                        {getOrdersByStatus(status).map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onStatusChange={(newStatus) => {
                                    socket?.emit('order:update', {
                                        orderId: order.id,
                                        status: newStatus
                                    });
                                }}
                            />
                        ))}
                    </div>
                </div>
            ))}
            {!connected && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
                    Disconnected - Trying to reconnect...
                </div>
            )}
        </div>
    );
};