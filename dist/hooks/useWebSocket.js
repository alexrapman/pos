"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOrderSync = exports.useWebSocket = void 0;
// src/hooks/useWebSocket.ts
const react_1 = require("react");
const socket_io_client_1 = require("socket.io-client");
const useToken_1 = require("./useToken");
const useWebSocket = () => {
    const [socket, setSocket] = (0, react_1.useState)(null);
    const [connected, setConnected] = (0, react_1.useState)(false);
    const { token } = (0, useToken_1.useToken)();
    (0, react_1.useEffect)(() => {
        const socketInstance = (0, socket_io_client_1.io)(process.env.REACT_APP_WS_URL, {
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
    const emit = (0, react_1.useCallback)((event, data) => {
        if (socket?.connected) {
            socket.emit(event, data);
        }
    }, [socket]);
    return { socket, connected, emit };
};
exports.useWebSocket = useWebSocket;
const useWebSocket_1 = require("./useWebSocket");
const useOrderSync = () => {
    const [orders, setOrders] = (0, react_1.useState)([]);
    const { socket, connected } = (0, exports.useWebSocket)();
    (0, react_1.useEffect)(() => {
        if (!socket)
            return;
        socket.on('order:created', (order) => {
            setOrders(prev => [...prev, order]);
        });
        socket.on('order:updated', (updatedOrder) => {
            setOrders(prev => prev.map(order => order.id === updatedOrder.id ? updatedOrder : order));
        });
        socket.on('order:deleted', (orderId) => {
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
exports.useOrderSync = useOrderSync;
