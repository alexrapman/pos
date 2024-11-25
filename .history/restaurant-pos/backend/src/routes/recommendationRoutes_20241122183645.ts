// backend/src/routes/recommendationRoutes.ts
import { Router } from 'express';
import { RecommendationController } from '../controllers/RecommendationController';

const router = Router();
const recommendationController = new RecommendationController();

router.get('/:productId', (req, res) => recommendationController.getRecommendation(req, res));
router.post('/', (req, res) => recommendationController.createRecommendation(req, res));

export default router;