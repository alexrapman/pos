// backend/src/controllers/AdvancedMetricsController.ts
import { Request, Response } from 'express';
import { Order, Product } from '../models';
import { Op, fn, col, literal } from 'sequelize';
import { startOfDay, endOfDay, subPeriod, format } from 'date-fns';

export class AdvancedMetricsController {
  async getAdvancedMetrics(req: Request, res: Response) {
    try {
      const { startDate, endDate, view } = req.query;
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      
      const [
        revenue,
        orders,
        categoryPerformance,
        revenueTrend
      ] = await Promise.all([
        this.calculateRevenue(start, end),
        this.calculateOrders(start, end),
        this.getCategoryPerformance(start, end),
        this.getRevenueTrend(start, end, view as string)
      ]);

      // Calcular período anterior para comparación
      const previousStart = subPeriod(start, end);
      const previousRevenue = await this.calculateRevenue(previousStart, start);
      const revenueGrowth = ((revenue - previousRevenue) / previousRevenue) * 100;

      res.json({
        totalRevenue: revenue,
        totalOrders: orders.count,
        averageOrderValue: revenue / orders.count,
        orderGrowth: revenueGrowth,
        categoryPerformance,
        revenueTrend
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching advanced metrics' });
    }
  }

  private async calculateRevenue(start: Date, end: Date) {
    const result = await Order.sum('total', {
      where: {
        createdAt: { [Op.between]: [start, end] }
      }
    });
    return result || 0;
  }

  private async calculateOrders(start: Date, end: Date) {
    return await Order.findOne({
      attributes: [
        [fn('COUNT', col('id')), 'count'],
        [fn('AVG', col('total')), 'average']
      ],
      where: {
        createdAt: { [Op.between]: [start, end] }
      },
      raw: true
    });
  }

  private async getCategoryPerformance(start: Date, end: Date) {
    return await Product.findAll({
      attributes: [
        'category',
        [fn('COUNT', col('Orders.id')), 'orders'],
        [fn('SUM', col('Orders.total')), 'revenue']
      ],
      include: [{
        model: Order,
        attributes: [],
        where: {
          createdAt: { [Op.between]: [start, end] }
        }
      }],
      group: ['category'],
      raw: true
    });
  }

  private async getRevenueTrend(start: Date, end: Date, view: string) {
    const grouping = view === 'daily' ? 'day' : view === 'weekly' ? 'week' : 'month';
    
    return await Order.findAll({
      attributes: [
        [fn('date_trunc', grouping, col('createdAt')), 'date'],
        [fn('SUM', col('total')), 'revenue']
      ],
      where: {
        createdAt: { [Op.between]: [start, end] }
      },
      group: [fn('date_trunc', grouping, col('createdAt'))],
      order: [[fn('date_trunc', grouping, col('createdAt')), 'ASC']],
      raw: true
    });
  }
}