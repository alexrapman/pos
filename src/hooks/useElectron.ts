// src/hooks/useElectron.ts
import { useEffect, useCallback } from 'react';
import { Order } from '../models/Order';

export const useElectron = () => {
    useEffect(() => {
        window.electron?.orderService.onFocusOrder((orderId) => {
            // Handle order focus - could scroll to order or highlight it
            document.getElementById(`order-${orderId}`)?.scrollIntoView({
                behavior: 'smooth'
            });
        });
    }, []);

    const notifyPriorityOrder = useCallback((order: Order) => {
        window.electron?.orderService.notifyPriority(order);
    }, []);

    const notifyOrderComplete = useCallback((orderId: string) => {
        window.electron?.orderService.notifyComplete(orderId);
    }, []);

    return {
        notifyPriorityOrder,
        notifyOrderComplete
    };
};

// src/components/App.tsx
import React from 'react';
import { WindowControls } from './WindowControls';
import { KitchenDisplay } from './kitchen/KitchenDisplay';
import { useElectron } from '../hooks/useElectron';

export const App: React.FC = () => {
    const { notifyPriorityOrder, notifyOrderComplete } = useElectron();

    return (
        <div className= "min-h-screen bg-gray-100" >
        <WindowControls />
        < KitchenDisplay
    onPriorityOrder = { notifyPriorityOrder }
    onOrderComplete = { notifyOrderComplete }
        />
        </div>
    );
};