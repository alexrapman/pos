// frontend/components/kitchen/KitchenDisplay.tsx
import React, { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { Order } from '../../types';

export const KitchenDisplay: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const socket = useSocket();

    useEffect(() => {
        socket.on('new-order', (order: Order) => {
            setOrders(prev => [...prev, order]);
        });

        socket.on('order-updated', (updatedOrder: Order) => {
            setOrders(prev => prev.map(order =>
                order.id === updatedOrder.id ? updatedOrder : order
            ));
        });

        return () => {
            socket.off('new-order');
            socket.off('order-updated');
        };
    }, [socket]);

    const updateOrderStatus = (orderId: string, status: string) => {
        socket.emit('update-order', { orderId, status });
    };

    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            {/* Pedidos Pendientes */}
            <div className="bg-red-100 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Pendientes</h2>
                {orders
                    .filter(order => order.status === 'pending')
                    .map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onUpdateStatus={updateOrderStatus}
                        />
                    ))}
            </div>

            {/* En Preparación */}
            <div className="bg-yellow-100 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-4">En Preparación</h2>
                {orders
                    .filter(order => order.status === 'preparing')
                    .map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onUpdateStatus={updateOrderStatus}
                        />
                    ))}
            </div>

            {/* Listos */}
            <div className="bg-green-100 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Listos</h2>
                {orders
                    .filter(order => order.status === 'ready')
                    .map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onUpdateStatus={updateOrderStatus}
                        />
                    ))}
            </div>
        </div>
    );
};