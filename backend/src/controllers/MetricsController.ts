// backend/src/controllers/MetricsController.ts
import { Request, Response } from 'express';
import { Order, Product, OrderProduct } from '../models/';
import { Op, fn, col, literal } from 'sequelize';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import { MetricsCollectionService } from '../services/MetricsCollectionService';

export class MetricsController {
  private metricsService = MetricsCollectionService.getInstance();

  async getDailySalesMetrics(req: Request, res: Response) {
    try {
      const { date = new Date() } = req.query;
      const start = startOfDay(new Date(date as string));
      const end = endOfDay(new Date(date as string));

      const metrics = await Order.findAll({
        attributes: [
          [fn('sum', col('total')), 'totalSales'],
          [fn('count', col('id')), 'orderCount'],
          [literal('SUM(total)/COUNT(id)'), 'averageOrderValue']
        ],
        where: {
          createdAt: {
            [Op.between]: [start, end]
          }
        },
        raw: true
      });

      return res.json(metrics[0]);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching daily metrics' });
    }
  }

  async getWeeklySalesMetrics(req: Request, res: Response) {
    try {
      const weeks = parseInt(req.query.weeks as string) || 4;
      const endDate = endOfWeek(new Date());
      const startDate = startOfWeek(subWeeks(endDate, weeks - 1));

      const metrics = await Order.findAll({
        attributes: [
          [fn('date_trunc', 'week', col('createdAt')), 'week'],
          [fn('sum', col('total')), 'totalSales'],
          [fn('count', col('id')), 'orderCount']
        ],
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        },
        group: [fn('date_trunc', 'week', col('createdAt'))],
        order: [[fn('date_trunc', 'week', col('createdAt')), 'ASC']],
        raw: true
      });

      return res.json(metrics);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching weekly metrics' });
    }
  }

  async getPopularProductsMetrics(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const metrics = await OrderProduct.findAll({
        attributes: [
          'productId',
          [fn('sum', col('quantity')), 'totalQuantity'],
          [fn('sum', literal('quantity * price')), 'totalRevenue']
        ],
        include: [{
          model: Product,
          attributes: ['name', 'price']
        }],
        group: ['productId', 'Product.id'],
        order: [[fn('sum', col('quantity')), 'DESC']],
        limit,
        raw: true
      });

      return res.json(metrics);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching product metrics' });
    }
  }

  async getLiveMetrics(req: Request, res: Response) {
    try {
      const metrics = await this.metricsService.collectMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch metrics' });
    }
  }

  async getHistoricalMetrics(req: Request, res: Response) {
    try {
      const { start, end, interval } = req.query;
      const startDate = new Date(start as string);
      const endDate = new Date(end as string);

      const metrics = await this.metricsService.getHistoricalMetrics(
        startDate,
        endDate
      );

      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch historical metrics' });
    }
  }
}

async exportMetrics(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.query;
    const metrics = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [{
        model: Product,
        through: { attributes: ['quantity'] }
      }],
      order: [['createdAt', 'ASC']]
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=metrics.csv');
    res.send(convertToCSV(metrics));
  } catch (error) {
    res.status(500).json({ error: 'Error exporting metrics' });
  }
}