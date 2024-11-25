// backend/src/services/InventoryService.ts
import { Product } from '../models/Product';
import { StockMovement, PurchaseOrder, Supplier } from '../models/Inventory';
import { Op } from 'sequelize';

export class InventoryService {
  private readonly LOW_STOCK_THRESHOLD = 10;

  async updateStock(productId: number, quantity: number, type: 'in' | 'out', reason: string) {
    const product = await Product.findByPk(productId);
    if (!product) throw new Error('Product not found');

    await sequelize.transaction(async (t) => {
      // Actualizar stock
      const newStock = type === 'in' 
        ? product.stock + quantity
        : product.stock - quantity;

      if (newStock < 0) throw new Error('Insufficient stock');

      await product.update({ stock: newStock }, { transaction: t });

      // Registrar movimiento
      await StockMovement.create({
        productId,
        quantity,
        type,
        reason
      }, { transaction: t });

      // Verificar nivel bajo de stock
      if (newStock <= this.LOW_STOCK_THRESHOLD) {
        await this.createAutomaticPurchaseOrder(product);
      }
    });
  }

  async createAutomaticPurchaseOrder(product: Product) {
    const supplier = await Supplier.findOne({
      where: { id: product.supplierId }
    });

    if (!supplier) throw new Error('No supplier found for product');

    const orderQuantity = this.calculateOrderQuantity(product);

    await PurchaseOrder.create({
      supplierId: supplier.id,
      totalAmount: orderQuantity * product.price,
      status: 'pending',
      items: [{
        productId: product.id,
        quantity: orderQuantity,
        price: product.price
      }]
    });
  }

  private calculateOrderQuantity(product: Product): number {
    // Lógica para calcular cantidad óptima de pedido
    const reorderPoint = this.LOW_STOCK_THRESHOLD * 2;
    return reorderPoint - product.stock;
  }

  async getStockAlerts() {
    return await Product.findAll({
      where: {
        stock: {
          [Op.lte]: this.LOW_STOCK_THRESHOLD
        }
      }
    });
  }
}