// backend/src/__tests__/integration/inventory.test.ts
import request from 'supertest';
import { app } from '../../server';
import { Product, StockMovement, PurchaseOrder } from '../../models';
import { sequelize } from '../../config/database';
import jwt from 'jsonwebtoken';

describe('Inventory Integration Tests', () => {
  let authToken: string;
  let testProduct: any;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    // Create test user and token
    authToken = jwt.sign(
      { id: 1, role: 'admin' },
      process.env.JWT_SECRET || 'test-secret'
    );

    // Create test product
    testProduct = await Product.create({
      name: 'Test Product',
      price: 10,
      stock: 20,
      minStock: 10
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Stock Management', () => {
    it('debería actualizar el stock correctamente', async () => {
      const response = await request(app)
        .post('/api/inventory/stock/update')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: testProduct.id,
          quantity: 5,
          type: 'out',
          reason: 'Test withdrawal'
        });

      expect(response.status).toBe(200);
      
      const updatedProduct = await Product.findByPk(testProduct.id);
      expect(updatedProduct?.stock).toBe(15);
    });

    it('debería crear alerta de stock bajo', async () => {
      await request(app)
        .post('/api/inventory/stock/update')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          productId: testProduct.id,
          quantity: 10,
          type: 'out',
          reason: 'Test withdrawal'
        });

      const alerts = await request(app)
        .get('/api/inventory/alerts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(alerts.body).toContainEqual(
        expect.objectContaining({
          id: testProduct.id,
          stock: 5
        })
      );
    });
  });

  describe('Purchase Orders', () => {
    it('debería crear orden automática en stock bajo', async () => {
      const orders = await PurchaseOrder.findAll({
        where: {
          status: 'pending'
        }
      });

      expect(orders).toHaveLength(1);
      expect(orders[0].items).toContainEqual(
        expect.objectContaining({
          productId: testProduct.id
        })
      );
    });
  });
});