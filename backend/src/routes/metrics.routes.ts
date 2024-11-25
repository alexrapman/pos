// backend/src/routes/metrics.routes.ts
import { Router } from 'express';
import { MetricsController } from '../controllers/MetricsController';
import { authMiddleware, checkRole } from '../middleware/auth';

const router = Router();
const controller = new MetricsController();

router.use(authMiddleware);
router.use(checkRole(['admin']));

router.get('/live', controller.getLiveMetrics.bind(controller));
router.get('/historical', controller.getHistoricalMetrics.bind(controller));

export default router;