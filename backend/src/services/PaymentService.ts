// backend/src/services/PaymentService.ts
import Stripe from 'stripe';
import { Order } from '../models/Order';
import PDFDocument from 'pdfkit';
import fs from 'fs';

export class PaymentService {
    private stripe: Stripe;
    private readonly TAX_RATE = 0.21; // 21% VAT

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2023-10-16'
        });
    }

    async processPayment(orderId: number, paymentMethod: string) {
        const order = await Order.findByPk(orderId);
        if (!order) throw new Error('Order not found');

        const amount = this.calculateTotalWithTax(order.total);

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe uses cents
            currency: 'eur',
            payment_method: paymentMethod,
            confirm: true,
            return_url: `${process.env.FRONTEND_URL}/payment/complete`
        });

        await this.generateReceipt(order, amount);

        return paymentIntent;
    }

    private calculateTotalWithTax(subtotal: number): number {
        return subtotal * (1 + this.TAX_RATE);
    }

    private async generateReceipt(order: Order, totalWithTax: number) {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(`receipts/receipt-${order.id}.pdf`);

        doc.pipe(stream);
        doc.fontSize(20).text('Receipt', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Order #${order.id}`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`);
        doc.moveDown();
        
        // Order details
        order.items.forEach(item => {
            doc.text(`${item.quantity}x ${item.name} - €${item.price}`);
        });

        doc.moveDown();
        doc.text(`Subtotal: €${order.total}`);
        doc.text(`TAX (${this.TAX_RATE * 100}%): €${order.total * this.TAX_RATE}`);
        doc.text(`Total: €${totalWithTax}`);

        doc.end();
    }

    async createPaymentIntent(order: Order): Promise<Stripe.PaymentIntent> {
        return await this.stripe.paymentIntents.create({
            amount: Math.round(order.total * 100), // Convert to cents
            currency: 'usd',
            metadata: {
                orderId: order.id.toString()
            }
        });
    }

    async handleWebhook(payload: any, signature: string): Promise<void> {
        try {
            const event = this.stripe.webhooks.constructEvent(
                payload,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            );

            switch (event.type) {
                case 'payment_intent.succeeded':
                    await this.handlePaymentSuccess(event.data.object);
                    break;
                case 'payment_intent.failed':
                    await this.handlePaymentFailure(event.data.object);
                    break;
            }
        } catch (err) {
            console.error('Webhook error:', err);
            throw err;
        }
    }

    private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
        const orderId = parseInt(paymentIntent.metadata.orderId);
        await Order.update(
            { paymentStatus: 'paid' },
            { where: { id: orderId } }
        );
    }

    private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
        const orderId = parseInt(paymentIntent.metadata.orderId);
        await Order.update(
            { paymentStatus: 'failed' },
            { where: { id: orderId } }
        );
    }
}