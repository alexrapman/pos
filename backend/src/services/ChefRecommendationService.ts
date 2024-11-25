// backend/src/services/ChefRecommendationService.ts
import { Recipe } from '../models/Recipe';
import { Op } from 'sequelize';

interface MatchScore {
  recipe: Recipe;
  score: number;
  matchedIngredients: string[];
}

export class ChefRecommendationService {
  async getRecommendations(ingredients: string[]): Promise<MatchScore[]> {
    const recipes = await Recipe.findAll();
    
    const scoredRecipes = recipes.map(recipe => {
      const matchedIngredients = recipe.ingredients.filter(
        ing => ingredients.some(
          userIng => userIng.toLowerCase().includes(ing.toLowerCase())
        )
      );

      const score = this.calculateScore(recipe, matchedIngredients);

      return {
        recipe,
        score,
        matchedIngredients
      };
    });

    return scoredRecipes
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  private calculateScore(recipe: Recipe, matchedIngredients: string[]): number {
    const matchRatio = matchedIngredients.length / recipe.ingredients.length;
    const difficultyBonus = {
      'easy': 1.2,
      'medium': 1,
      'hard': 0.8
    }[recipe.difficulty];

    const timeBonus = recipe.preparationTime <= 30 ? 1.2 : 1;

    return matchRatio * difficultyBonus * timeBonus * 100;
  }

  async getTipsForRecipe(recipeId: number): Promise<string[]> {
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) return [];

    const baseTips = recipe.tips;
    const difficultyTips = this.getDifficultySpecificTips(recipe.difficulty);

    return [...baseTips, ...difficultyTips];
  }

  private getDifficultySpecificTips(difficulty: string): string[] {
    const tips = {
      'easy': [
        'Perfect for beginners!',
        'Take your time with each step'
      ],
      'medium': [
        'Read all instructions before starting',
        'Prep all ingredients in advance'
      ],
      'hard': [
        'Consider mise en place essential',
        'Temperature control is crucial'
      ]
    };

    return tips[difficulty] || [];
  }
}