// backend/src/services/ChefService.ts
export class ChefService {
    async getRecipeRecommendation(ingredients: string[]) {
      const recipes = await Recipe.findAll({
        where: {
          ingredients: {
            [Op.overlap]: ingredients
          }
        }
      });
  
      return recipes.sort((a, b) => 
        this.calculateMatchScore(b, ingredients) - 
        this.calculateMatchScore(a, ingredients)
      )[0];
    }
  
    private calculateMatchScore(recipe: Recipe, ingredients: string[]): number {
      return recipe.ingredients.filter(i => 
        ingredients.includes(i)
      ).length;
    }
  }
  