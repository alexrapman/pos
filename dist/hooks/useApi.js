"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOrders = exports.useApi = void 0;
// src/hooks/useApi.ts
const react_1 = require("react");
const useToken_1 = require("./useToken");
const useApi = () => {
    const { token } = (0, useToken_1.useToken)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchApi = (0, react_1.useCallback)(async (endpoint, options = {}) => {
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
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [token]);
    return { fetchApi, loading, error };
};
exports.useApi = useApi;
// src/hooks/useOrders.ts
const react_2 = require("react");
const useApi_1 = require("./useApi");
const useOrders = () => {
    const [orders, setOrders] = (0, react_1.useState)([]);
    const { fetchApi, loading, error } = (0, exports.useApi)();
    const fetchOrders = (0, react_1.useCallback)(async () => {
        const data = await fetchApi('/orders');
        setOrders(data);
    }, [fetchApi]);
    (0, react_2.useEffect)(() => {
        fetchOrders();
    }, [fetchOrders]);
    const createOrder = (0, react_1.useCallback)(async (orderData) => {
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
exports.useOrders = useOrders;
