// frontend/components/notifications/OrderNotifications.tsx
import React, { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { toast } from 'react-toastify';
import { Order } from '../../types';

export const OrderNotifications: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const socket = useSocket();

    useEffect(() => {
        socket.on('new-order', (order: Order) => {
            setOrders(prev => [...prev, order]);
            toast.success(`Nuevo pedido para la mesa ${order.tableNumber}`);
        });

        socket.on('order-updated', (updatedOrder: Order) => {
            setOrders(prev => prev.map(order =>
                order.id === updatedOrder.id ? updatedOrder : order
            ));
            toast.info(`Pedido actualizado para la mesa ${updatedOrder.tableNumber}`);
        });

        return () => {
            socket.off('new-order');
            socket.off('order-updated');
        };
    }, [socket]);

    return null;
};