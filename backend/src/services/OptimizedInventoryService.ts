// backend/src/services/OptimizedInventoryService.ts
import { InventoryRepository } from '../repositories/InventoryRepository';
import { CacheService } from './CacheService';
import { EventEmitter } from 'events';
import { sequelize } from '../config/database';
import { Queue } from 'bull';

export class OptimizedInventoryService extends EventEmitter {
  private repository: InventoryRepository;
  private cache: CacheService;
  private stockUpdateQueue: Queue;

  constructor() {
    super();
    this.repository = new InventoryRepository();
    this.cache = new CacheService();
    this.stockUpdateQueue = new Queue('stock-updates');
    this.setupQueueHandlers();
  }

  private setupQueueHandlers() {
    this.stockUpdateQueue.process(async (job) => {
      const { productId, quantity, type } = job.data;
      await this.processStockUpdate(productId, quantity, type);
    });
  }

  async getProductInventory() {
    const cacheKey = 'product-inventory';
    const cached = await this.cache.get(cacheKey);
    
    if (cached) return cached;

    const products = await this.repository.getProductsWithStock();
    await this.cache.set(cacheKey, products, 300); // 5 minutos
    
    return products;
  }

  async updateStock(updates: Array<{ productId: number, quantity: number, type: 'in' | 'out' }>) {
    const transaction = await sequelize.transaction();

    try {
      for (const update of updates) {
        await this.stockUpdateQueue.add(update);
      }
      
      await transaction.commit();
      this.emit('stockUpdated', updates);
      await this.cache.invalidate('product-inventory');
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private async processStockUpdate(productId: number, quantity: number, type: string) {
    await this.repository.updateProductStock(
      productId,
      quantity,
      type,
      { logging: false } // Desactivar logs SQL para operaciones batch
    );

    const stockLevel = await this.repository.getProductStock(productId);
    
    if (stockLevel <= 0) {
      this.emit('outOfStock', { productId, currentStock: stockLevel });
    }
  }

  async getPurchaseOrdersAnalytics() {
    const cacheKey = 'purchase-orders-analytics';
    const cached = await this.cache.get(cacheKey);

    if (cached) return cached;

    const analytics = await this.repository.getPurchaseOrdersWithAnalytics();
    await this.cache.set(cacheKey, analytics, 1800); // 30 minutos
    
    return analytics;
  }
}