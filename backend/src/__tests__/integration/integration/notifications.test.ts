// backend/src/__tests__/integration/notifications.test.ts
import { app } from '../../server';
import request from 'supertest';
import { User } from '../../models/User';
import { NotificationService } from '../../services/NotificationService';
import { sequelize } from '../../config/database';

describe('Notification Integration Tests', () => {
  let service: NotificationService;
  let testUser: any;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    testUser = await User.create({
      email: 'test@example.com',
      role: 'admin',
      pushSubscription: JSON.stringify({
        endpoint: 'https://test.push.service',
        keys: { auth: 'test-auth' }
      })
    });

    service = new NotificationService();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('debería procesar notificación completa', async () => {
    const alertData = {
      type: 'lowStock',
      message: 'Test integration alert',
      priority: 'high',
      data: { productId: 1 }
    };

    const response = await request(app)
      .post('/api/notifications/alert')
      .send({
        userRole: 'admin',
        ...alertData
      });

    expect(response.status).toBe(200);

    // Verificar email enviado
    const emails = await service.emailTransport.getSentMail();
    expect(emails).toHaveLength(1);
    expect(emails[0].to).toBe(testUser.email);

    // Verificar notificación in-app
    const notifications = await service.notificationRepository.findAll({
      where: { userId: testUser.id }
    });
    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe('lowStock');
  });

  it('debería manejar múltiples destinatarios', async () => {
    const users = await User.bulkCreate([
      { email: 'admin1@test.com', role: 'admin' },
      { email: 'admin2@test.com', role: 'admin' }
    ]);

    const response = await request(app)
      .post('/api/notifications/alert')
      .send({
        userRole: 'admin',
        type: 'outOfStock',
        message: 'Test multiple recipients'
      });

    expect(response.status).toBe(200);

    const notifications = await service.notificationRepository.findAll({
      where: {
        userId: users.map(u => u.id)
      }
    });

    expect(notifications).toHaveLength(users.length);
  });
});