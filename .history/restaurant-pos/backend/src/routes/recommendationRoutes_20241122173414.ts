// backend/src/routes/recommendationRoutes.ts
import { Router } from 'express';
import { Recommendation } from '../models/Recommendation';

const router = Router();

router.get('/:productId', async (req, res) => {
    const { productId } = req.params;
    const recommendation = await Recommendation.findOne({ where: { productId } });
    if (recommendation) {
        res.json(recommendation);
    } else {
        res.status(404).send('Recomendación no encontrada');
    }
});

router.post('/', async (req, res) => {
    const recommendation = await Recommendation.create(req.body);
    res.json(recommendation);
});

export default router;