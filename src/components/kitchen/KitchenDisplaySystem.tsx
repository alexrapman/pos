// src/components/kitchen/KitchenDisplaySystem.tsx
import React, { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { KitchenGrid } from './KitchenGrid';
import { OrderStatusBar } from './OrderStatusBar';
import { useOrderSync } from '../../hooks/useOrderSync';
import { Order, OrderStatus } from '../../models/Order';

export const KitchenDisplaySystem: React.FC = () => {
    const { orders, connected } = useOrderSync();
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [notification] = useState(new Audio('/sounds/new-order.mp3'));

    // Filter active orders
    useEffect(() => {
        setActiveOrders(orders.filter(order =>
            order.status !== OrderStatus.DELIVERED &&
            order.status !== OrderStatus.CANCELLED
        ));
    }, [orders]);

    // Play sound on new orders
    useEffect(() => {
        const newOrders = orders.filter(order => order.status === OrderStatus.PENDING);
        if (newOrders.length > 0) {
            notification.play().catch(console.error);
        }
    }, [orders, notification]);

    // Keyboard shortcuts
    useHotkeys('ctrl+1', () => document.getElementById('pending-orders')?.focus());
    useHotkeys('ctrl+2', () => document.getElementById('preparing-orders')?.focus());
    useHotkeys('ctrl+3', () => document.getElementById('ready-orders')?.focus());

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <OrderStatusBar
                totalOrders={activeOrders.length}
                connected={connected}
            />

            <div className="flex-1 p-4">
                <KitchenGrid
                    orders={activeOrders}
                    priorities={calculatePriorities(activeOrders)}
                />
            </div>

            <div className="fixed bottom-4 right-4 space-x-2">
                <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+1</kbd>
                <span className="text-sm">New Orders</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+2</kbd>
                <span className="text-sm">Preparing</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+3</kbd>
                <span className="text-sm">Ready</span>
            </div>
        </div>
    );
};

const calculatePriorities = (orders: Order[]): Record<string, number> => {
    return orders.reduce((acc, order) => {
        const waitTime = Date.now() - new Date(order.createdAt).getTime();
        const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
        acc[order.id] = Math.floor((waitTime / 1000 / 60) + (itemCount * 2));
        return acc;
    }, {} as Record<string, number>);
};