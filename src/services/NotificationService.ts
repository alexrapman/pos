// src/services/NotificationService.ts
import { Order } from '../models/Order';

interface NotificationConfig {
    enableSound: boolean;
    enableDesktop: boolean;
    priorityThreshold: number; // minutes
}

export class NotificationService {
    private config: NotificationConfig;
    private audio: Record<string, HTMLAudioElement>;
    private priorityOrders: Set<string>;

    constructor(config: Partial<NotificationConfig> = {}) {
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

    async checkOrderPriority(order: Order): Promise<void> {
        const waitTime = Date.now() - new Date(order.createdAt).getTime();
        const isPriority = waitTime > this.config.priorityThreshold * 60 * 1000;

        if (isPriority && !this.priorityOrders.has(order.id)) {
            this.priorityOrders.add(order.id);
            await this.notifyPriorityOrder(order);
        }
    }

    private async notifyPriorityOrder(order: Order): Promise<void> {
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

    public clearPriorityOrder(orderId: string): void {
        this.priorityOrders.delete(orderId);
    }
}