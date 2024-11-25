// src/api/controllers/OrderController.ts
import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../../services/OrderService';
import { OrderStatus } from '../../models/Order';

export class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    async createOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const { tableNumber, items } = req.body;
            const order = await this.orderService.createOrder(tableNumber, items);
            res.status(201).json(order);
        } catch (error) {
            next(error);
        }
    }

    async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status } = req.body as { status: OrderStatus };
            const order = await this.orderService.updateOrderStatus(id, status);
            res.json(order);
        } catch (error) {
            next(error);
        }
    }

    async getOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const order = await this.orderService.getOrder(id);
            res.json(order);
        } catch (error) {
            next(error);
        }
    }

    async getAllOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const orders = await this.orderService.getAllOrders();
            res.json(orders);
        } catch (error) {
            next(error);
        }
    }
}