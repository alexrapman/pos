"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
// src/services/OrderService.ts
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
class OrderService {
    async createOrder(tableNumber, items) {
        const total = await this.calculateTotal(items);
        const order = await Order_1.Order.create({
            tableNumber,
            items,
            total,
            status: Order_1.OrderStatus.PENDING
        });
        return order.toJSON();
    }
    async updateOrderStatus(orderId, status) {
        const order = await Order_1.Order.findByPk(orderId);
        if (!order)
            throw new Error('Order not found');
        order.status = status;
        await order.save();
        return order.toJSON();
    }
    async deleteOrder(orderId) {
        const order = await Order_1.Order.findByPk(orderId);
        if (!order)
            throw new Error('Order not found');
        await order.destroy();
    }
    async getOrder(orderId) {
        const order = await Order_1.Order.findByPk(orderId);
        if (!order)
            throw new Error('Order not found');
        return order.toJSON();
    }
    async getAllOrders() {
        const orders = await Order_1.Order.findAll();
        return orders.map(order => order.toJSON());
    }
    async calculateTotal(items) {
        let total = 0;
        for (const item of items) {
            const product = await Product_1.Product.findByPk(item.productId);
            if (!product)
                throw new Error(`Product ${item.productId} not found`);
            total += product.price * item.quantity;
        }
        return total;
    }
}
exports.OrderService = OrderService;
