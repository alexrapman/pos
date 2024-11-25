// backend/src/controllers/base.controller.ts
import { Request, Response, NextFunction } from 'express';
import { BaseService } from '../services/base.service';

export abstract class BaseController<T> {
  constructor(protected service: BaseService<T>) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.service.findById(Number(req.params.id));
      if (!result) return res.status(404).json({ message: 'Not found' });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await this.service.findAll(req.query);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
}