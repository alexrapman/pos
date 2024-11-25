// backend/src/events/InventoryEvents.ts
import { EventEmitter } from 'events';
import { NotificationService } from '../services/NotificationService';

export class InventoryEventManager extends EventEmitter {
  private notificationService: NotificationService;

  constructor() {
    super();
    this.notificationService = new NotificationService();
    this.setupSubscribers();
  }

  private setupSubscribers() {
    // Stock bajo
    this.on('lowStock', async ({ productId, currentStock }) => {
      await this.notificationService.sendAlert('admin', {
        type: 'lowStock',
        message: `Product ${productId} is low on stock (${currentStock} remaining)`
      });
    });

    // Stock agotado
    this.on('outOfStock', async ({ productId }) => {
      await this.notificationService.sendAlert('admin', {
        type: 'outOfStock',
        message: `Product ${productId} is out of stock!`,
        priority: 'high'
      });
    });

    // Orden automática generada
    this.on('autoOrderCreated', async (order) => {
      await this.notificationService.sendAlert('admin', {
        type: 'autoOrder',
        message: `Automatic order #${order.id} created for low stock items`,
        data: order
      });
    });
  }
}