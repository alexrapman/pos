// src/hooks/useApi.ts
import { useState, useCallback } from 'react';
import { useToken } from './useToken';

interface ApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
}

export const useApi = () => {
    const { token } = useToken();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchApi = useCallback(async (endpoint: string, options: ApiOptions = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
                method: options.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: options.body ? JSON.stringify(options.body) : undefined
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (err: any) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token]);

    return { fetchApi, loading, error };
};

// src/hooks/useOrders.ts
import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { Order } from '../models/Order';

export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const { fetchApi, loading, error } = useApi();

    const fetchOrders = useCallback(async () => {
        const data = await fetchApi('/orders');
        setOrders(data);
    }, [fetchApi]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const createOrder = useCallback(async (orderData: Partial<Order>) => {
        const newOrder = await fetchApi('/orders', {
            method: 'POST',
            body: orderData
        });
        setOrders(prev => [...prev, newOrder]);
        return newOrder;
    }, [fetchApi]);

    return {
        orders,
        loading,
        error,
        fetchOrders,
        createOrder
    };
};