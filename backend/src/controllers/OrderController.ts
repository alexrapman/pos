// src/controllers/OrderController.ts
import { Request, Response } from 'express';
import { Order } from '../models/Order';

export class OrderController {
  async create(req: Request, res: Response) {
    try {
      const order = await Order.create(req.body);
      return res.status(201).json(order);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid order data' });
    }
  }

  async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;
    
    try {
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      await order.update({ status });
      return res.json(order);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}