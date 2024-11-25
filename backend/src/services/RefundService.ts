// backend/src/services/RefundService.ts
import Stripe from 'stripe';
import { Payment } from '../models/Payment';
import { PaymentStatus } from '../models/PaymentStatus';
import { NotificationService } from './NotificationService';

export class RefundService {
    private stripe: Stripe;
    private notificationService: NotificationService;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
        this.notificationService = new NotificationService();
    }

    async initiateRefund(paymentId: number): Promise<Stripe.Refund> {
        const payment = await Payment.findByPk(paymentId);
        if (!payment) throw new Error('Payment not found');

        const refund = await this.stripe.refunds.create({
            payment_intent: payment.stripePaymentIntentId,
        });

        await this.updatePaymentStatus(payment, refund);
        return refund;
    }

    private async updatePaymentStatus(payment: Payment, refund: Stripe.Refund) {
        await payment.update({
            status: PaymentStatus.REFUNDED,
            metadata: {
                ...payment.metadata,
                refundId: refund.id,
                refundStatus: refund.status,
                refundedAt: new Date().toISOString()
            }
        });

        await this.notificationService.sendRefundNotification(payment);
    }
}

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