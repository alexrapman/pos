// src/components/kitchen/KitchenDisplay.tsx
import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { NotificationService } from '../../services/NotificationService';
import { Order, OrderStatus } from '../../models/Order';
import { OrderCard } from './OrderCard';

export const KitchenDisplay: React.FC = () => {
    const { socket, connected } = useWebSocket();
    const [orders, setOrders] = useState<Order[]>([]);
    const [notificationService] = useState(() => new NotificationService({
        enableSound: true,
        enableDesktop: true,
        priorityThreshold: 15
    }));

    useEffect(() => {
        if (!socket) return;

        socket.emit('join:kitchen');

        socket.on('order:new', (order: Order) => {
            setOrders(prev => [...prev, order]);
            notificationService.notifyNewOrder(order);
        });

        socket.on('order:updated', (updatedOrder: Order) => {
            setOrders(prev => prev.map(order =>
                order.id === updatedOrder.id ? updatedOrder : order
            ));

            if (updatedOrder.status === OrderStatus.DELIVERED) {
                notificationService.clearPriorityOrder(updatedOrder.id);
            }
        });

        // Check for priority orders every minute
        const priorityCheck = setInterval(() => {
            orders.forEach(order => {
                if (order.status !== OrderStatus.DELIVERED) {
                    notificationService.checkOrderPriority(order);
                }
            });
        }, 60000);

        return () => {
            socket.off('order:new');
            socket.off('order:updated');
            clearInterval(priorityCheck);
        };
    }, [socket, orders, notificationService]);

    return (
        <div className= "grid grid-cols-3 gap-4 p-4" >
        {
            Object.values(OrderStatus).map(status => (
                <div key= { status } className = "bg-white rounded-lg shadow p-4" >
                <h2 className="text-xl font-bold mb-4" > { status } </h2>
            < div className = "space-y-4" >
            {
                orders
                            .filter(order => order.status === status)
                    .map(order => (
                        <OrderCard 
                                    key= { order.id } 
                                    order = { order }
                                    onStatusChange = {(newStatus) => {
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
</div>
    );
};