// backend/src/__tests__/services/PaymentService.test.ts
import { PaymentService } from '../../services/PaymentService';
import { Order } from '../../models/Order';
import Stripe from 'stripe';

jest.mock('stripe');
jest.mock('../../models/Order');

describe('PaymentService', () => {
  let paymentService: PaymentService;
  
  beforeEach(() => {
    paymentService = new PaymentService();
  });

  describe('processPayment', () => {
    it('debería procesar el pago correctamente', async () => {
      const mockOrder = {
        id: 1,
        total: 100,
        items: [
          { name: 'Pizza', quantity: 2, price: 50 }
        ]
      };

      (Order.findByPk as jest.Mock).mockResolvedValue(mockOrder);
      
      const mockPaymentIntent = {
        id: 'pi_123',
        client_secret: 'secret_123'
      };

      (Stripe.prototype.paymentIntents.create as jest.Mock)
        .mockResolvedValue(mockPaymentIntent);

      const result = await paymentService.processPayment(1, 'pm_123');

      expect(result).toEqual(mockPaymentIntent);
    });

    it('debería manejar errores cuando el pedido no existe', async () => {
      (Order.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(
        paymentService.processPayment(1, 'pm_123')
      ).rejects.toThrow('Order not found');
    });
  });
});