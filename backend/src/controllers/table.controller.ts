// backend/src/controllers/table.controller.ts
import { Request, Response, NextFunction } from 'express';
import { TableService } from '../services/table.service';

export class TableController extends BaseController<Table> {
  constructor() {
    super(new TableService());
  }

  async checkAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, partySize } = req.query;
      const tables = await (this.service as TableService)
        .checkAvailability(new Date(date as string), Number(partySize));
      res.json(tables);
    } catch (error) {
      next(error);
    }
  }
}