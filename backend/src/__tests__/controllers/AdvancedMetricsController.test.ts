// backend/src/__tests__/controllers/AdvancedMetricsController.test.ts
import { AdvancedMetricsController } from '../../controllers/AdvancedMetricsController';
import { Order, Product } from '../../models';
import { mockRequest, mockResponse } from 'jest-mock-req-res';

jest.mock('../../models');

describe('AdvancedMetricsController', () => {
  let controller: AdvancedMetricsController;
  let req: any;
  let res: any;

  beforeEach(() => {
    controller = new AdvancedMetricsController();
    req = mockRequest({
      query: {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        view: 'daily'
      }
    });
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('getAdvancedMetrics', () => {
    it('should return metrics data', async () => {
      const mockOrders = [
        { id: 1, total: 100, createdAt: '2024-01-01' },
        { id: 2, total: 200, createdAt: '2024-01-02' }
      ];

      (Order.sum as jest.Mock).mockResolvedValue(300);
      (Order.findOne as jest.Mock).mockResolvedValue({ count: 2, average: 150 });
      (Product.findAll as jest.Mock).mockResolvedValue([
        { category: 'Food', orders: 5, revenue: 500 }
      ]);

      await controller.getAdvancedMetrics(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        totalRevenue: 300,
        totalOrders: 2,
        averageOrderValue: 150
      }));
    });

    it('should handle errors', async () => {
      (Order.sum as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await controller.getAdvancedMetrics(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Error fetching advanced metrics'
      });
    });
  });
});