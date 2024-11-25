// backend/src/services/order.service.ts
import { Order } from '../models/order.model';
import { TableRepository } from '../repositories/table.repository';
import { OrderRepository } from '../repositories/order.repository';
import { EventEmitter } from '../utils/eventEmitter';

export class OrderService extends BaseService<Order> {
  private tableRepository: TableRepository;
  private eventEmitter: EventEmitter;

  constructor() {
    super(new OrderRepository());
    this.tableRepository = new TableRepository();
    this.eventEmitter = EventEmitter.getInstance();
  }

  async createOrder(data: Partial<Order>): Promise<Order> {
    const table = await this.tableRepository.findById(data.tableId!);
    if (!table) throw new Error('Table not found');
    if (table.status !== 'available') throw new Error('Table not available');

    await this.tableRepository.update(table.id, { status: 'occupied' });
    const order = await super.create(data);
    
    this.eventEmitter.emit('orderCreated', order);
    return order;
  }

  async updateOrderStatus(
    id: number, 
    status: Order['status']
  ): Promise<Order | null> {
    const order = await this.repository.findById(id);
    if (!order) throw new Error('Order not found');

    const updatedOrder = await super.update(id, { status });
    this.eventEmitter.emit('orderStatusUpdated', updatedOrder);
    
    if (status === 'delivered') {
      await this.tableRepository.update(order.tableId, { 
        status: 'available' 
      });
    }

    return updatedOrder;
  }
}