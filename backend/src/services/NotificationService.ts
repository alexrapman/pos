// backend/src/services/NotificationService.ts
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { Payment } from '../models/Payment';
import { Order } from '../models/Order';
import { EventEmitter } from 'events';
import { webpush } from 'web-push';
import { User } from '../models/User';

interface Notification {
    id: string;
    type: 'info' | 'warning' | 'error';
    message: string;
    timestamp: Date;
}

interface NotificationOptions {
  type: 'lowStock' | 'outOfStock' | 'autoOrder';
  message: string;
  priority?: 'low' | 'medium' | 'high';
  data?: any;
}

export class NotificationService extends EventEmitter {
    private emailTransporter: nodemailer.Transporter;
    private twilioClient: twilio.Twilio;
    private notifications: Notification[] = [];
    private emailTransport;

    constructor() {
        super();
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

        this.emailTransport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        webpush.setVapidDetails(
            'mailto:admin@example.com',
            process.env.VAPID_PUBLIC_KEY!,
            process.env.VAPID_PRIVATE_KEY!
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

    createNotification(type: Notification['type'], message: string) {
        const notification: Notification = {
            id: crypto.randomUUID(),
            type,
            message,
            timestamp: new Date()
        };
        this.notifications.push(notification);
        this.emit('new-notification', notification);
    }

    getNotifications() {
        return this.notifications;
    }

    async sendAlert(userRole: string, options: NotificationOptions) {
        const users = await User.findAll({
            where: { role: userRole }
        });

        await Promise.all([
            this.sendEmails(users, options),
            this.sendPushNotifications(users, options),
            this.saveInAppNotification(users, options)
        ]);
    }

    private async sendEmails(users: User[], options: NotificationOptions) {
        const emailPromises = users.map(user => 
            this.emailTransport.sendMail({
                from: process.env.EMAIL_FROM,
                to: user.email,
                subject: `[${options.priority?.toUpperCase() || 'INFO'}] ${options.type}`,
                text: options.message,
                html: this.getEmailTemplate(options)
            })
        );

        return Promise.all(emailPromises);
    }

    private async sendPushNotifications(users: User[], options: NotificationOptions) {
        const pushPromises = users.map(user => {
            if (!user.pushSubscription) return;
            
            return webpush.sendNotification(
                JSON.parse(user.pushSubscription),
                JSON.stringify({
                    title: options.type,
                    body: options.message,
                    data: options.data
                })
            );
        });

        return Promise.all(pushPromises);
    }

    private async saveInAppNotification(users: User[], options: NotificationOptions) {
        // Guardar notificación en la base de datos para mostrar en la interfaz
        const notifications = users.map(user => ({
            userId: user.id,
            type: options.type,
            message: options.message,
            priority: options.priority || 'low',
            data: options.data,
            read: false
        }));

        return await this.notificationRepository.bulkCreate(notifications);
    }

    private getEmailTemplate(options: NotificationOptions): string {
        // Template HTML básico para emails
        return `
            <div style="padding: 20px; background: #f5f5f5;">
                <h2>${options.type}</h2>
                <p>${options.message}</p>
                ${options.data ? `<pre>${JSON.stringify(options.data, null, 2)}</pre>` : ''}
            </div>
        `;
    }
}