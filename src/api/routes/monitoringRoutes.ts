// src/api/routes/monitoringRoutes.ts
import { Router } from 'express';
import { authorize } from '../middleware/authMiddleware';
import { SessionCleanupService } from '../../services/SessionCleanupService';
import { UserRole } from '../../models/User';

const router = Router();
const sessionCleanup = new SessionCleanupService();

router.get('/stats', authorize([UserRole.ADMIN]), async (req, res) => {
    const stats = await sessionCleanup.getSessionStats();
    res.json(stats);
});

export { router as monitoringRouter };