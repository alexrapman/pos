// backend/src/repositories/InventoryRepository.ts
import { Product, StockMovement, PurchaseOrder, Supplier } from '../models';
import { Op, literal } from 'sequelize';

export class InventoryRepository {
  async getProductsWithStock() {
    return await Product.findAll({
      attributes: [
        'id',
        'name',
        'stock',
        'minStock',
        [literal('(stock <= minStock)'), 'needsReorder']
      ],
      include: [{
        model: Supplier,
        attributes: ['id', 'name'],
        required: false
      }],
      order: [
        [literal('stock <= minStock'), 'DESC'],
        ['name', 'ASC']
      ]
    });
  }

  async getStockMovements(startDate: Date, endDate: Date) {
    return await StockMovement.findAll({
      attributes: [
        'id',
        'type',
        'quantity',
        'createdAt',
        [literal('Product.name'), 'productName']
      ],
      include: [{
        model: Product,
        attributes: ['name'],
        required: true
      }],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['createdAt', 'DESC']],
      limit: 1000
    });
  }

  async getPendingPurchaseOrders() {
    return await PurchaseOrder.findAll({
      attributes: [
        'id',
        'status',
        'totalAmount',
        'createdAt',
        [literal('Supplier.name'), 'supplierName']
      ],
      include: [{
        model: Supplier,
        attributes: ['name'],
        required: true
      }],
      where: {
        status: 'pending'
      },
      order: [['createdAt', 'ASC']]
    });
  }
}