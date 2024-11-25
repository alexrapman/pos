// backend/src/models/migrations/20240314_add_indexes.ts
import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // Índices para productos
    await queryInterface.addIndex('Products', ['stock'], {
      name: 'idx_products_stock'
    });

    await queryInterface.addIndex('Products', ['supplierId'], {
      name: 'idx_products_supplier'
    });

    // Índices para movimientos de stock
    await queryInterface.addIndex('StockMovements', ['productId', 'type'], {
      name: 'idx_stock_movements_product_type'
    });

    await queryInterface.addIndex('StockMovements', ['createdAt'], {
      name: 'idx_stock_movements_date'
    });

    // Índices para órdenes de compra
    await queryInterface.addIndex('PurchaseOrders', ['status', 'supplierId'], {
      name: 'idx_purchase_orders_status_supplier'
    });

    await queryInterface.addIndex('PurchaseOrders', ['createdAt'], {
      name: 'idx_purchase_orders_date'
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeIndex('Products', 'idx_products_stock');
    await queryInterface.removeIndex('Products', 'idx_products_supplier');
    await queryInterface.removeIndex('StockMovements', 'idx_stock_movements_product_type');
    await queryInterface.removeIndex('StockMovements', 'idx_stock_movements_date');
    await queryInterface.removeIndex('PurchaseOrders', 'idx_purchase_orders_status_supplier');
    await queryInterface.removeIndex('PurchaseOrders', 'idx_purchase_orders_date');
  }
};