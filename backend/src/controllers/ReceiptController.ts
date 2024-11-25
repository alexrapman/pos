// backend/src/controllers/ReceiptController.ts
import { Request, Response } from 'express';
import { ReceiptService } from '../services/ReceiptService';
import { Order } from '../models/Order';
import fs from 'fs/promises';

export class ReceiptController {
    private receiptService: ReceiptService;

    constructor() {
        this.receiptService = new ReceiptService();
    }

    async generateReceipt(req: Request, res: Response) {
        try {
            const { orderId } = req.params;
            const order = await Order.findByPk(orderId);

            if (!order) {
                return res.status(404).json({ error: 'Pedido no encontrado' });
            }

            const filePath = await this.receiptService.generateReceipt(order);

            // Configurar headers para descarga
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=receipt-${orderId}.pdf`);

            // Enviar archivo y eliminar después
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
            fileStream.on('end', async () => {
                await fs.unlink(filePath);
            });

        } catch (error) {
            console.error('Error generando recibo:', error);
            res.status(500).json({ error: 'Error generando recibo' });
        }
    }

    async getReceiptHistory(req: Request, res: Response) {
        try {
            const { startDate, endDate } = req.query;

            const orders = await Order.findAll({
                where: {
                    status: 'paid',
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                order: [['createdAt', 'DESC']]
            });

            res.json(orders);
        } catch (error) {
            console.error('Error obteniendo historial:', error);
            res.status(500).json({ error: 'Error obteniendo historial' });
        }
    }
}