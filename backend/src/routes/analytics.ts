// backend/src/routes/analytics.ts
import { Router } from 'express';
import AnalyticsService from '../services/AnalyticsService';
import { trackEvent } from '../middleware/eventTracking';

const router = Router();

router.get('/metrics',
    trackEvent('analytics_view'),
    async (req, res) => {
        const { startDate, endDate } = req.query;
        const metrics = await AnalyticsService.getSalesMetrics(
            new Date(startDate as string),
            new Date(endDate as string)
        );
        res.json(metrics);
    }
);

export default router;