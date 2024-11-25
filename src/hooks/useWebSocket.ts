// src/hooks/useWebSocket.ts
import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToken } from './useToken';

export const useWebSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const { token } = useToken();

    useEffect(() => {
        const socketInstance = io(process.env.REACT_APP_WS_URL!, {
            auth: { token },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socketInstance.on('connect', () => setConnected(true));
        socketInstance.on('disconnect', () => setConnected(false));

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [token]);

    const emit = useCallback((event: string, data: any) => {
        if (socket?.connected) {
            socket.emit(event, data);
        }
    }, [socket]);

    return { socket, connected, emit };
};

// src/hooks/useOrderSync.ts
import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';
import { Order } from '../models/Order';

export const useOrderSync = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const { socket, connected } = useWebSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('order:created', (order: Order) => {
            setOrders(prev => [...prev, order]);
        });

        socket.on('order:updated', (updatedOrder: Order) => {
            setOrders(prev => prev.map(order =>
                order.id === updatedOrder.id ? updatedOrder : order
            ));
        });

        socket.on('order:deleted', (orderId: string) => {
            setOrders(prev => prev.filter(order => order.id !== orderId));
        });

        return () => {
            socket.off('order:created');
            socket.off('order:updated');
            socket.off('order:deleted');
        };
    }, [socket]);

    return { orders, connected };
};