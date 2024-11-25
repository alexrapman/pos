// backend/src/services/ReportService.ts
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { Sequelize } from 'sequelize';

export class ReportService {
    async generateSalesReport(startDate: Date, endDate: Date) {
        const orders = await Order.findAll({
            where: {
                createdAt: {
                    [Sequelize.Op.between]: [startDate, endDate]
                }
            },
            include: [Product]
        });

        const report = orders.map(order => ({
            orderId: order.id,
            date: order.createdAt,
            total: order.total,
            items: order.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            }))
        }));

        return report;
    }
}