// src/controllers/ProductController.ts
import { Request, Response } from 'express';
import { Product } from '../models/Product';

export class ProductController {
  async getAll(req: Request, res: Response) {
    try {
      const products = await Product.findAll();
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const product = await Product.create(req.body);
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid product data' });
    }
  }
}