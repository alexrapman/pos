// src/services/WebSocketManager.ts
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Order, OrderStatus } from '../models/Order';

export class WebSocketManager {
    private io: Server;

    constructor(server: HttpServer) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.CLIENT_URL || 'http://localhost:3000',
                methods: ['GET', 'POST']
            }
        });

        this.initialize();
    }

    private initialize() {
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('join:kitchen', () => {
                socket.join('kitchen');
            });

            socket.on('join:waitstaff', () => {
                socket.join('waitstaff');
            });

            socket.on('order:update', async (data: {
                orderId: string;
                status: OrderStatus
            }) => {
                try {
                    const order = await Order.findByPk(data.orderId);
                    if (order) {
                        await order.update({ status: data.status });
                        this.io.to('kitchen').emit('order:updated', order);
                        this.io.to('waitstaff').emit('order:updated', order);
                    }
                } catch (error) {
                    console.error('Order update failed:', error);
                }
            });
        });
    }

    public notifyNewOrder(order: Order) {
        this.io.to('kitchen').emit('order:new', order);
    }

    public notifyOrderUpdate(order: Order) {
        this.io.emit('order:updated', order);
    }
}