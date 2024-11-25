// backend/src/services/NotificationService.ts
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { Payment } from '../models/Payment';
import { Order } from '../models/Order';

export class NotificationService {
    private emailTransporter: nodemailer.Transporter;
    private twilioClient: twilio.Twilio;

    constructor() {
        this.emailTransporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        this.twilioClient = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
    }

    async sendRefundNotification(payment: Payment) {
        const order = await Order.findByPk(payment.orderId);
        if (!order) return;

        await Promise.all([
            this.sendEmailNotification(order, payment),
            this.sendSMSNotification(order, payment),
            this.sendWebhookNotification(order, payment)
        ]);
    }

    private async sendEmailNotification(order: Order, payment: Payment) {
        const template = this.getEmailTemplate('refund', { order, payment });

        await this.emailTransporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: order.customerEmail,
            subject: 'Refund Processed',
            html: template
        });
    }

    private async sendSMSNotification(order: Order, payment: Payment) {
        if (!order.customerPhone) return;

        await this.twilioClient.messages.create({
            body: `Your refund of $${payment.amount} for order #${order.id} has been processed.`,
            to: order.customerPhone,
            from: process.env.TWILIO_PHONE_NUMBER
        });
    }

    private async sendWebhookNotification(order: Order, payment: Payment) {
        const webhookUrls = await this.getWebhookUrls();

        const notifications = webhookUrls.map(url =>
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order, payment })
            })
        );

        await Promise.allSettled(notifications);
    }
}