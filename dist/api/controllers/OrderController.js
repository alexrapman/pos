"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const OrderService_1 = require("../../services/OrderService");
class OrderController {
    constructor() {
        this.orderService = new OrderService_1.OrderService();
    }
    async createOrder(req, res, next) {
        try {
            const { tableNumber, items } = req.body;
            const order = await this.orderService.createOrder(tableNumber, items);
            res.status(201).json(order);
        }
        catch (error) {
            next(error);
        }
    }
    async updateOrderStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const order = await this.orderService.updateOrderStatus(id, status);
            res.json(order);
        }
        catch (error) {
            next(error);
        }
    }
    async getOrder(req, res, next) {
        try {
            const { id } = req.params;
            const order = await this.orderService.getOrder(id);
            res.json(order);
        }
        catch (error) {
            next(error);
        }
    }
    async getAllOrders(req, res, next) {
        try {
            const orders = await this.orderService.getAllOrders();
            res.json(orders);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.OrderController = OrderController;
