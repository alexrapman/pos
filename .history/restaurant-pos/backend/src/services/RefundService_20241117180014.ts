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