// backend/src/controllers/PaymentController.ts
import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';
import { Payment } from '../models/Payment';
import { Order } from '../models/Order';

export class PaymentController {
    private paymentService: PaymentService;

    constructor() {
        this.paymentService = new PaymentService();
    }

    async processPayment(req: Request, res: Response) {
        try {
            const { orderId, paymentMethod } = req.body;
            const paymentIntent = await this.paymentService.processPayment(
                orderId,
                paymentMethod
            );
            res.json({ clientSecret: paymentIntent.client_secret });
        } catch (error) {
            res.status(500).json({ error: 'Payment processing failed' });
        }
    }

    constructor() {
        this.paymentService = new PaymentService();
    }

    async createPaymentIntent(req: Request, res: Response) {
        try {
            const { orderId } = req.body;
            const order = await Order.findByPk(orderId);

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            const paymentIntent = await this.paymentService.createPaymentIntent(order);

            await Payment.create({
                orderId,
                amount: order.total,
                stripePaymentIntentId: paymentIntent.id,
                status: 'pending'
            });

            res.json({ clientSecret: paymentIntent.client_secret });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create payment intent' });
        }
    }

    async getPaymentStatus(req: Request, res: Response) {
        try {
            const { orderId } = req.params;
            const payment = await Payment.findOne({
                where: { orderId },
                order: [['createdAt', 'DESC']]
            });

            if (!payment) {
                return res.status(404).json({ error: 'Payment not found' });
            }

            res.json({ status: payment.status });
        } catch (error) {
            res.status(500).json({ error: 'Failed to get payment status' });
        }
    }

    async initiateRefund(req: Request, res: Response) {
        try {
            const { paymentId } = req.params;
            const refundService = new RefundService();

            const refund = await refundService.initiateRefund(parseInt(paymentId));

            res.json({
                success: true,
                refundId: refund.id,
                status: refund.status
            });
        } catch (error) {
            res.status(500).json({
                error: 'Failed to process refund',
                message: error.message
            });
        }
    }
}