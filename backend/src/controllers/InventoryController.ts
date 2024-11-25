// backend/src/controllers/InventoryController.ts
import { Request, Response } from 'express';
import { InventoryService } from '../services/InventoryService';

export class InventoryController {
  private inventoryService: InventoryService;

  constructor() {
    this.inventoryService = new InventoryService();
  }

  async updateStock(req: Request, res: Response) {
    try {
      const { productId, quantity, type, reason } = req.body;
      await this.inventoryService.updateStock(productId, quantity, type, reason);
      res.json({ message: 'Stock updated successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getStockAlerts(req: Request, res: Response) {
    try {
      const alerts = await this.inventoryService.getStockAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching stock alerts' });
    }
  }

  async getPurchaseOrders(req: Request, res: Response) {
    try {
      const orders = await this.inventoryService.getPurchaseOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching purchase orders' });
    }
  }
}
