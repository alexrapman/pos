// src/__tests__/controllers/OrderController.test.ts
import { Request, Response } from 'express';
import { OrderController } from '../../controllers/OrderController';
import { Order } from '../../models/Order';

jest.mock('../../models/Order');

describe('OrderController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let orderController: OrderController;

  beforeEach(() => {
    mockRequest = {
      params: {},
      body: {}
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    orderController = new OrderController();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const mockOrder = { 
        id: 1, 
        tableNumber: 5,
        status: 'pending'
      };
      mockRequest.body = mockOrder;

      (Order.create as jest.Mock).mockResolvedValue(mockOrder);

      await orderController.create(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOrder);
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const mockOrder = {
        id: 1,
        status: 'pending',
        update: jest.fn()
      };
      mockRequest.params = { id: '1' };
      mockRequest.body = { status: 'preparing' };

      (Order.findByPk as jest.Mock).mockResolvedValue(mockOrder);
      mockOrder.update.mockResolvedValue({
        ...mockOrder,
        status: 'preparing'
      });

      await orderController.updateStatus(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockOrder.update).toHaveBeenCalledWith({ 
        status: 'preparing' 
      });
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });
});