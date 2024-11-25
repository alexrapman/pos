/ backend/src/routes/chef.ts
import { Router } from 'express';
import { ChefController } from '../controllers/ChefController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const chefController = new ChefController();

router.use(authMiddleware);
router.post('/recommend', chefController.getRecommendation.bind(chefController));

export default router;