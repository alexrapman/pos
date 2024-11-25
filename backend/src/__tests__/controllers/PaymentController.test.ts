// backend/src/__tests__/controllers/PaymentController.test.ts
import { PaymentController } from '../../controllers/PaymentController';
import { PaymentService } from '../../services/PaymentService';

jest.mock('../../services/PaymentService');

describe('PaymentController', () => {
  let controller: PaymentController;
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    controller = new PaymentController();
    mockRequest = {
      body: {
        orderId: 1,
        paymentMethod: 'pm_123'
      }
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  it('debería procesar el pago exitosamente', async () => {
    const mockPaymentIntent = {
      id: 'pi_123',
      client_secret: 'secret_123'
    };

    (PaymentService.prototype.processPayment as jest.Mock)
      .mockResolvedValue(mockPaymentIntent);

    await controller.processPayment(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith({
      clientSecret: 'secret_123'
    });
  });

  it('debería manejar errores de pago', async () => {
    (PaymentService.prototype.processPayment as jest.Mock)
      .mockRejectedValue(new Error('Payment failed'));

    await controller.processPayment(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Payment processing failed'
    });
  });
});