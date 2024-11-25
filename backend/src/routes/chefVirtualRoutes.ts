// backend/src/routes/chefVirtualRoutes.ts
import { Router } from 'express';
import { ChefVirtualService } from '../services/ChefVirtualService';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const chefVirtualService = new ChefVirtualService();

router.get('/recommendations', authenticateToken, async (req, res) => {
    const recommendations = await chefVirtualService.generateRecommendations(req.user.id);
    res.json(recommendations);
});

export default router;