// backend/src/controllers/order.controller.ts
import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';

export class OrderController extends BaseController<Order> {
  constructor() {
    super(new OrderService());
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await (this.service as OrderService).createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await (this.service as OrderService)
        .updateOrderStatus(Number(id), status);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
}
