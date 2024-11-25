// backend/src/services/StripeService.ts
import Stripe from 'stripe';

export class StripeService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2023-10-16'
        });
    }

    async createPaymentIntent(amount: number): Promise<Stripe.PaymentIntent> {
        return await this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convertir a centavos
            currency: 'eur',
            automatic_payment_methods: {
                enabled: true
            }
        });
    }
}

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