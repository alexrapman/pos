// backend/src/services/EmailService.ts
import nodemailer from 'nodemailer';
import { EmailTemplateManager } from '../templates/EmailTemplates';
import i18next from 'i18next';
import { Order } from '../models/Order';
import { ReceiptService } from './ReceiptService';
import path from 'path';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import { Environment } from '../config/environment';

export class EmailService {
    private transporter: nodemailer.Transporter;
    private templateManager: EmailTemplateManager;
    private receiptService: ReceiptService;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: Environment.getInstance().config.email.host,
            port: 587,
            auth: {
                user: Environment.getInstance().config.email.user,
                pass: Environment.getInstance().config.email.pass
            }
        });
        this.templateManager = new EmailTemplateManager();
        this.receiptService = new ReceiptService();
    }

    async sendReport(
        recipients: string[],
        subject: string,
        attachment: Buffer
    ): Promise<void> {
        await this.transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: recipients.join(','),
            subject,
            attachments: [{
                filename: `report-${format(new Date(), 'yyyy-MM-dd')}.pdf`,
                content: attachment
            }]
        });
    }

    async sendLocalizedEmail(to: string, type: string, data: any, locale: string) {
        const translation = await i18next.getFixedT(locale);
        const template = this.templateManager.getTemplate(type, {
            ...data,
            t: translation
        });

        // Send email implementation
    }

    async sendReceiptEmail(order: Order, emailTo: string): Promise<void> {
        try {
            // Generar PDF del recibo
            const receiptPath = await this.receiptService.generateReceipt(order);

            // Cargar plantilla de email
            const templatePath = path.join(__dirname, '../templates/receipt-email.hbs');
            const template = await fs.readFile(templatePath, 'utf-8');
            const compiledTemplate = Handlebars.compile(template);

            // Preparar datos para la plantilla
            const emailContent = compiledTemplate({
                orderNumber: order.id,
                total: order.total.toFixed(2),
                date: new Date().toLocaleDateString(),
                items: order.items
            });

            // Enviar email
            await this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: emailTo,
                subject: `Recibo Pedido #${order.id}`,
                html: emailContent,
                attachments: [{
                    filename: `recibo-${order.id}.pdf`,
                    path: receiptPath
                }]
            });

            // Limpiar archivo temporal
            await fs.unlink(receiptPath);

        } catch (error) {
            console.error('Error enviando email:', error);
            throw new Error('Error al enviar el recibo por email');
        }
    }

    async sendOrderConfirmation(email: string, order: any) {
        await this.transporter.sendMail({
            from: '"Restaurant POS" <no-reply@example.com>',
            to: email,
            subject: 'Order Confirmation',
            text: `Your order #${order.id} has been confirmed.`,
            html: `<p>Your order #${order.id} has been confirmed.</p>`
        });
    }
}