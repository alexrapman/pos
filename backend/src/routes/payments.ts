// backend/src/routes/payments.ts
import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const controller = new PaymentController();

router.post('/create-intent', authenticateToken, controller.createPaymentIntent);
router.post('/webhook', controller.handleWebhook);
router.get('/status/:orderId', authenticateToken, controller.getPaymentStatus);
router.post('/refund/:paymentId', authenticateToken, controller.initiateRefund);
router.get('/history', authenticateToken, controller.getPaymentHistory);
router.use(authMiddleware);
router.post('/process', paymentController.processPayment.bind(paymentController));
