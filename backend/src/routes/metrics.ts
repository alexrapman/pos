// backend/src/routes/metrics.ts
import { Router } from 'express';
import { MetricsController } from '../controllers/MetricsController';
import { authMiddleware, checkRole } from '../middleware/auth';

const router = Router();
const metricsController = new MetricsController();

router.use(authMiddleware);
router.use(checkRole(['admin']));

router.get('/dashboard', metricsController.getDashboardMetrics);

router.get('/sales/daily', async (req, res) => {
  const metrics = await metricsController.getDailySalesMetrics(req.query);
  res.json(metrics);
});

router.get('/sales/weekly', async (req, res) => {
  const metrics = await metricsController.getWeeklySalesMetrics(req.query);
  res.json(metrics);
});

router.get('/products/popular', async (req, res) => {
  const metrics = await metricsController.getPopularProductsMetrics(req.query);
  res.json(metrics);
});

export default router;

// backend/src/server.ts - Actualizar
import metricsRouter from './routes/metrics';

app.use('/api/metrics', metricsRouter);