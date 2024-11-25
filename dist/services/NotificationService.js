"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
class NotificationService {
    constructor(config = {}) {
        this.config = {
            enableSound: true,
            enableDesktop: true,
            priorityThreshold: 15,
            ...config
        };
        this.audio = {
            newOrder: new Audio('/sounds/new-order.mp3'),
            priority: new Audio('/sounds/priority-alert.mp3'),
            ready: new Audio('/sounds/order-ready.mp3')
        };
        this.priorityOrders = new Set();
    }
    async checkOrderPriority(order) {
        const waitTime = Date.now() - new Date(order.createdAt).getTime();
        const isPriority = waitTime > this.config.priorityThreshold * 60 * 1000;
        if (isPriority && !this.priorityOrders.has(order.id)) {
            this.priorityOrders.add(order.id);
            await this.notifyPriorityOrder(order);
        }
    }
    async notifyPriorityOrder(order) {
        if (this.config.enableSound) {
            await this.audio.priority.play();
        }
        if (this.config.enableDesktop) {
            // Windows notification
            const notification = new Notification('Priority Order Alert', {
                body: `Order #${order.id} for Table ${order.tableNumber} is waiting too long!`,
                icon: '/icons/priority.png'
            });
            notification.onclick = () => {
                window.focus();
            };
        }
    }
    clearPriorityOrder(orderId) {
        this.priorityOrders.delete(orderId);
    }
}
exports.NotificationService = NotificationService;
