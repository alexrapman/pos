// backend/src/__tests__/services/NotificationService.test.ts
import { NotificationService } from '../../services/NotificationService';
import { User } from '../../models/User';
import nodemailer from 'nodemailer';
import webpush from 'web-push';

jest.mock('nodemailer');
jest.mock('web-push');
jest.mock('../../models/User');

describe('NotificationService', () => {
  let service: NotificationService;
  let mockTransport: any;

  beforeEach(() => {
    mockTransport = {
      sendMail: jest.fn().mockResolvedValue(true)
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransport);
    service = new NotificationService();
  });

  it('debería enviar emails a usuarios', async () => {
    const mockUsers = [
      { id: 1, email: 'admin1@test.com' },
      { id: 2, email: 'admin2@test.com' }
    ];

    (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

    await service.sendAlert('admin', {
      type: 'lowStock',
      message: 'Test alert',
      priority: 'high'
    });

    expect(mockTransport.sendMail).toHaveBeenCalledTimes(2);
    expect(mockTransport.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'admin1@test.com',
        subject: '[HIGH] lowStock'
      })
    );
  });

  it('debería enviar push notifications', async () => {
    const mockUsers = [{
      id: 1,
      pushSubscription: JSON.stringify({ endpoint: 'test' })
    }];

    (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

    await service.sendAlert('admin', {
      type: 'outOfStock',
      message: 'Test push'
    });

    expect(webpush.sendNotification).toHaveBeenCalledWith(
      { endpoint: 'test' },
      expect.any(String)
    );
  });

  it('debería guardar notificaciones in-app', async () => {
    const mockUsers = [{ id: 1 }, { id: 2 }];
    (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

    await service.sendAlert('admin', {
      type: 'autoOrder',
      message: 'Test in-app',
      data: { orderId: 123 }
    });

    expect(service.notificationRepository.bulkCreate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          userId: 1,
          type: 'autoOrder',
          read: false
        })
      ])
    );
  });
});