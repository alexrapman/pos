"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KitchenDisplay = void 0;
// src/components/kitchen/KitchenDisplay.tsx
const react_1 = __importStar(require("react"));
const useWebSocket_1 = require("../../hooks/useWebSocket");
const Order_1 = require("../../models/Order");
const KitchenDisplay = () => {
    const [orders, setOrders] = (0, react_1.useState)([]);
    const { socket, connected } = (0, useWebSocket_1.useWebSocket)();
    const [notification] = (0, react_1.useState)(new Audio('/sounds/new-order.mp3'));
    (0, react_1.useEffect)(() => {
        if (!socket)
            return;
        socket.emit('join:kitchen');
        socket.on('order:new', (order) => {
            setOrders(prev => [...prev, order]);
            notification.play().catch(console.error);
        });
        socket.on('order:updated', (updatedOrder) => {
            setOrders(prev => prev.map(order => order.id === updatedOrder.id ? updatedOrder : order));
        });
        return () => {
            socket.off('order:new');
            socket.off('order:updated');
        };
    }, [socket, notification]);
    const getOrdersByStatus = (status) => {
        return orders.filter(order => order.status === status);
    };
    return (<div className="grid grid-cols-3 gap-4 p-4">
            {Object.values(Order_1.OrderStatus).map(status => (<div key={status} className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-bold mb-4">{status}</h2>
                    <div className="space-y-4">
                        {getOrdersByStatus(status).map(order => (<OrderCard key={order.id} order={order} onStatusChange={(newStatus) => {
                    socket?.emit('order:update', {
                        orderId: order.id,
                        status: newStatus
                    });
                }}/>))}
                    </div>
                </div>))}
            {!connected && (<div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
                    Disconnected - Trying to reconnect...
                </div>)}
        </div>);
};
exports.KitchenDisplay = KitchenDisplay;
