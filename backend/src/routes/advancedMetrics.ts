// backend/src/routes/advancedMetrics.ts
import { Router } from 'express';
import { AdvancedMetricsController } from '../controllers/AdvancedMetricsController';
import { authMiddleware, checkRole } from '../middleware/auth';

const router = Router();
const advancedMetricsController = new AdvancedMetricsController();

// Proteger todas las rutas
router.use(authMiddleware);
router.use(checkRole(['admin']));

// Rutas métricas avanzadas
router.get('/dashboard', advancedMetricsController.getAdvancedMetrics);
router.get('/revenue-trend', advancedMetricsController.getRevenueTrend);
router.get('/category-performance', advancedMetricsController.getCategoryPerformance);
router.get('/export', advancedMetricsController.exportMetrics);

export default router;
