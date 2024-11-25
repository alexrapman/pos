// backend/src/services/AnalyticsService.ts
import { Order, Product, User } from '../models';
import { Op, fn, col } from 'sequelize';

export class AnalyticsService {
  async getSalesAnalytics(startDate: Date, endDate: Date) {
    return {
      revenue: await this.calculateRevenue(startDate, endDate),
      orderCount: await this.getOrderCount(startDate: Date, endDate: Date),
      averageOrderValue: await this.calculateAverageOrderValue(startDate, endDate),
      topProducts: await this.getTopProducts(startDate, endDate),
      salesByHour: await this.getSalesByHour(startDate, endDate)
    };
  }

  private async calculateRevenue(startDate: Date, endDate: Date) {
    const result = await Order.sum('total', {
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },
        status: 'completed'
      }
    });
    return result || 0;
  }

  private async getOrderCount(startDate: Date, endDate: Date) {
    return await Order.count({
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },
        status: 'completed'
      }
    });
  }

  private async getTopProducts(startDate: Date, endDate: Date) {
    return await Product.findAll({
      attributes: [
        'id',
        'name',
        [fn('COUNT', col('Orders.id')), 'orderCount'],
        [fn('SUM', col('Orders.total')), 'totalRevenue']
      ],
      include: [{
        model: Order,
        attributes: [],
        where: {
          createdAt: { [Op.between]: [startDate, endDate] },
          status: 'completed'
        }
      }],
      group: ['Product.id'],
      order: [[fn('COUNT', col('Orders.id')), 'DESC']],
      limit: 10
    });
  }

  private async getSalesByHour(startDate: Date, endDate: Date) {
    return await Order.findAll({
      attributes: [
        [fn('DATEPART', 'HOUR', col('createdAt')), 'hour'],
        [fn('COUNT', col('id')), 'count'],
        [fn('SUM', col('total')), 'total']
      ],
      where: {
        createdAt: { [Op.between]: [startDate, endDate] },
        status: 'completed'
      },
      group: [fn('DATEPART', 'HOUR', col('createdAt'))],
      order: [[fn('DATEPART', 'HOUR', col('createdAt')), 'ASC']]
    });
  }
}