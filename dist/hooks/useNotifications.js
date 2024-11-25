"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KitchenDisplay = void 0;
// src/components/kitchen/KitchenDisplay.tsx
const react_1 = require("react");
const useWebSocket_1 = require("../../hooks/useWebSocket");
const NotificationService_1 = require("../../services/NotificationService");
const Order_1 = require("../../models/Order");
const KitchenDisplay = () => {
    const { socket, connected } = (0, useWebSocket_1.useWebSocket)();
    const [orders, setOrders] = (0, react_1.useState)([]);
    const [notificationService] = (0, react_1.useState)(() => new NotificationService_1.NotificationService({
        enableSound: true,
        enableDesktop: true,
        priorityThreshold: 15
    }));
    (0, react_1.useEffect)(() => {
        if (!socket)
            return;
        socket.emit('join:kitchen');
        socket.on('order:new', (order) => {
            setOrders(prev => [...prev, order]);
            notificationService.notifyNewOrder(order);
        });
        socket.on('order:updated', (updatedOrder) => {
            setOrders(prev => prev.map(order => order.id === updatedOrder.id ? updatedOrder : order));
            if (updatedOrder.status === Order_1.OrderStatus.DELIVERED) {
                notificationService.clearPriorityOrder(updatedOrder.id);
            }
        });
        // Check for priority orders every minute
        const priorityCheck = setInterval(() => {
            orders.forEach(order => {
                if (order.status !== Order_1.OrderStatus.DELIVERED) {
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
    return className = "grid grid-cols-3 gap-4 p-4" >
        {
            Object, : .values(Order_1.OrderStatus).map(status => key = { status }, className = "bg-white rounded-lg shadow p-4" >
                className, "text-xl font-bold mb-4" > { status } < /h2>
                < div, className = "space-y-4" >
                {
                    orders,
                    : 
                        .filter(order => order.status === status)
                        .map(order => key = { order, : .id }, order = { order }, onStatusChange = {}(newStatus))
                })
        };
};
exports.KitchenDisplay = KitchenDisplay;
{
    socket?.emit('order:update', {
        orderId: order.id,
        status: newStatus
    });
}
/>;
/div>
    < /div>;
/div>;
;
;
