// src/components/kitchen/KitchenDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Order } from '../../models/Order';
import { useOrderSync } from '../../hooks/useOrderSync';
import { KitchenGrid } from './KitchenGrid';
import { OrderTimer } from './OrderTimer';

export const KitchenDashboard: React.FC = () => {
    const { orders, connected } = useOrderSync();
    const [priorities, setPriorities] = useState<Record<string, number>>({});

    // Calculate priorities based on wait time and order size
    useEffect(() => {
        const newPriorities = orders.reduce((acc, order) => {
            const waitTime = Date.now() - new Date(order.createdAt).getTime();
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
            acc[order.id] = Math.floor((waitTime / 1000 / 60) + (itemCount * 2));
            return acc;
        }, {} as Record<string, number>);

        setPriorities(newPriorities);
    }, [orders]);

    return (
        <div className="h-screen bg-gray-100 p-4">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Kitchen Display</h1>
                {!connected && (
                    <div className="bg-red-500 text-white px-4 py-2 rounded">
                        Connection Lost - Retrying...
                    </div>
                )}
            </div>

            <KitchenGrid
                orders={orders}
                priorities={priorities}
            />
        </div>
    );
};