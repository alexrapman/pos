// backend/src/routes/receiptRoutes.ts
import { Router } from 'express';
import { ReceiptController } from '../controllers/ReceiptController';
import { checkAuth } from '../middleware/auth';
import { validateDateRange } from '../middleware/validators';

const router = Router();
const receiptController = new ReceiptController();

// Generar recibo para un pedido específico
router.get(
    '/generate/:orderId',
    checkAuth,
    async (req, res) => await receiptController.generateReceipt(req, res)
);

// Obtener historial de recibos
router.get(
    '/history',
    checkAuth,
    validateDateRange,
    async (req, res) => await receiptController.getReceiptHistory(req, res)
);

// Descargar recibo en formato PDF
router.get(
    '/download/:orderId',
    checkAuth,
    async (req, res) => {
        try {
            const { orderId } = req.params;
            await receiptController.generateReceipt(req, res);
        } catch (error) {
            res.status(500).json({
                error: 'Error al descargar el recibo',
                details: error.message
            });
        }
    }
);

// Reenviar recibo por email
router.post(
    '/email/:orderId',
    checkAuth,
    async (req, res) => {
        try {
            const { orderId } = req.params;
            const { email } = req.body;

            const filePath = await receiptController.generateReceipt(req, res);
            // TODO: Implementar envío de email con el recibo adjunto

            res.json({ message: 'Recibo enviado correctamente' });
        } catch (error) {
            res.status(500).json({
                error: 'Error al enviar el recibo',
                details: error.message
            });
        }
    }
);

export default router;