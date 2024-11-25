
// backend/src/__tests__/controllers/ChefController.test.ts
import { ChefController } from '../../controllers/ChefController';
import { ChefRecommendationService } from '../../services/ChefRecommendationService';

jest.mock('../../services/ChefRecommendationService');

describe('ChefController', () => {
  let controller: ChefController;
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    controller = new ChefController();
    mockRequest = {
      body: { ingredients: ['tomato', 'cheese'] },
      params: {}
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('getRecommendations', () => {
    it('should return recommendations when valid ingredients provided', async () => {
      const mockRecommendations = [{
        recipe: {
          toJSON: () => ({
            id: 1,
            name: 'Test Recipe'
          })
        },
        score: 90,
        matchedIngredients: ['tomato']
      }];

      (ChefRecommendationService.prototype.getRecommendations as jest.Mock)
        .mockResolvedValue(mockRecommendations);

      await controller.getRecommendations(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({
        recommendations: expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            name: 'Test Recipe',
            score: 90
          })
        ])
      });
    });

    it('should return 400 for invalid ingredients', async () => {
      mockRequest.body.ingredients = [''];

      await controller.getRecommendations(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });
});