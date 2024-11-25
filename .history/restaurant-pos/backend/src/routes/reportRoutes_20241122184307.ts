// backend/src/routes/reportRoutes.ts
import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';
import { authenticateToken } from '../middleware/auth';
import { authorizeRoles } from '../middleware/authorize';

const router = Router();
const reportController = new ReportController();

router.get('/sales', authenticateToken, authorizeRoles('admin'), (req, res) => reportController.getSalesReport(req, res));

export default router;