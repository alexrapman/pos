// backend/src/controllers/ChefController.ts
import { Request, Response } from 'express';
import { ChefRecommendationService } from '../services/ChefRecommendationService';
import { validateIngredients } from '../validators/chefValidators';

export class ChefController {
    private chefService: ChefRecommendationService;

    constructor() {
        this.chefService = new ChefRecommendationService();
    }

    async getRecommendations(req: Request, res: Response) {
        try {
            const { ingredients } = req.body;

            // Validate input
            const { error } = validateIngredients(ingredients);
            if (error) {
                return res.status(400).json({ error: error.message });
            }

            const recommendations = await this.chefService.getRecommendations(ingredients);
            
            if (recommendations.length === 0) {
                return res.status(404).json({ 
                    message: 'No recipes found with these ingredients' 
                });
            }

            res.json({
                recommendations: recommendations.map(r => ({
                    ...r.recipe.toJSON(),
                    score: r.score,
                    matchedIngredients: r.matchedIngredients
                }))
            });

        } catch (error) {
            console.error('Chef recommendation error:', error);
            res.status(500).json({ error: 'Error getting recommendations' });
        }
    }

    async getRecipeTips(req: Request, res: Response) {
        try {
            const { recipeId } = req.params;
            const tips = await this.chefService.getTipsForRecipe(parseInt(recipeId));
            res.json({ tips });
        } catch (error) {
            res.status(500).json({ error: 'Error getting recipe tips' });
        }
    }
}
