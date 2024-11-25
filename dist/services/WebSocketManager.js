"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketManager = void 0;
// src/services/WebSocketManager.ts
const socket_io_1 = require("socket.io");
const Order_1 = require("../models/Order");
class WebSocketManager {
    constructor(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: process.env.CLIENT_URL || 'http://localhost:3000',
                methods: ['GET', 'POST']
            }
        });
        this.initialize();
    }
    initialize() {
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);
            socket.on('join:kitchen', () => {
                socket.join('kitchen');
            });
            socket.on('join:waitstaff', () => {
                socket.join('waitstaff');
            });
            socket.on('order:update', async (data) => {
                try {
                    const order = await Order_1.Order.findByPk(data.orderId);
                    if (order) {
                        await order.update({ status: data.status });
                        this.io.to('kitchen').emit('order:updated', order);
                        this.io.to('waitstaff').emit('order:updated', order);
                    }
                }
                catch (error) {
                    console.error('Order update failed:', error);
                }
            });
        });
    }
    notifyNewOrder(order) {
        this.io.to('kitchen').emit('order:new', order);
    }
    notifyOrderUpdate(order) {
        this.io.emit('order:updated', order);
    }
}
exports.WebSocketManager = WebSocketManager;
