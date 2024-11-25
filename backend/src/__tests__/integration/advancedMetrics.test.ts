// backend/src/__tests__/integration/advancedMetrics.test.ts
import request from 'supertest';
import { app } from '../../server';
import { sequelize } from '../../config/database';
import { Order, Product, User } from '../../models';
import jwt from 'jsonwebtoken';

describe('Advanced Metrics Integration Tests', () => {
  let adminToken: string;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    // Create test admin user
    const admin = await User.create({
      username: 'admin',
      password: 'password',
      role: 'admin'
    });
    adminToken = jwt.sign(
      { id: admin.id, role: 'admin' },
      process.env.JWT_SECRET || 'test-secret'
    );
    
    // Seed test data
    await Promise.all([
      Product.bulkCreate([
        { name: 'Pizza', price: 10, category: 'Food' },
        { name: 'Burger', price: 8, category: 'Food' },
        { name: 'Cola', price: 2, category: 'Drinks' }
      ]),
      Order.bulkCreate([
        { total: 20, status: 'completed', createdAt: '2024-01-01' },
        { total: 30, status: 'completed', createdAt: '2024-01-02' },
        { total: 15, status: 'completed', createdAt: '2024-01-03' }
      ])
    ]);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/metrics/advanced/dashboard', () => {
    it('should return dashboard metrics', async () => {
      const response = await request(app)
        .get('/api/metrics/advanced/dashboard')
        .query({
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          view: 'daily'
        })
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalRevenue');
      expect(response.body).toHaveProperty('totalOrders');
      expect(response.body).toHaveProperty('categoryPerformance');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/metrics/advanced/dashboard')
        .query({
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          view: 'daily'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/metrics/advanced/export', () => {
    it('should export metrics data', async () => {
      const response = await request(app)
        .get('/api/metrics/advanced/export')
        .query({
          startDate: '2024-01-01',
          endDate: '2024-01-31'
        })
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('text/csv');
    });
  });
});