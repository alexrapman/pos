// backend/src/controllers/RecommendationController.ts
import { Request, Response } from 'express';
import { Recommendation } from '../models/Recommendation';

export class RecommendationController {
    async getRecommendation(req: Request, res: Response) {
        const { productId } = req.params;
        const recommendation = await Recommendation.findOne({ where: { productId } });
        if (recommendation) {
            res.json(recommendation);
        } else {
            res.status(404).send('Recomendación no encontrada');
        }
    }

    async createRecommendation(req: Request, res: Response) {
        const recommendation = await Recommendation.create(req.body);
        res.json(recommendation);
    }
}