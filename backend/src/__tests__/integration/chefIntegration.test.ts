// backend/src/__tests__/integration/chefIntegration.test.ts
import request from 'supertest';
import { app } from '../../server';
import { Recipe } from '../../models/Recipe';
import { sequelize } from '../../config/database';
import jwt from 'jsonwebtoken';

describe('Chef Virtual Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    // Create test recipes
    await Recipe.bulkCreate([
      {
        name: 'Margherita Pizza',
        ingredients: ['tomato', 'cheese', 'basil'],
        instructions: ['Make dough', 'Add toppings', 'Bake'],
        preparationTime: 30,
        difficulty: 'medium',
        tips: ['Use fresh ingredients']
      },
      {
        name: 'Pasta Carbonara',
        ingredients: ['pasta', 'eggs', 'cheese', 'bacon'],
        instructions: ['Cook pasta', 'Mix sauce', 'Combine'],
        preparationTime: 20,
        difficulty: 'easy',
        tips: ['Don\'t overcook pasta']
      }
    ]);

    // Generate test token
    authToken = jwt.sign(
      { id: 1, role: 'chef' },
      process.env.JWT_SECRET || 'test-secret'
    );
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/chef/recommendations', () => {
    it('should return matching recipes', async () => {
      const response = await request(app)
        .post('/api/chef/recommendations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ingredients: ['tomato', 'cheese']
        });

      expect(response.status).toBe(200);
      expect(response.body.recommendations).toHaveLength(1);
      expect(response.body.recommendations[0].name).toBe('Margherita Pizza');
    });

    it('should handle no matches', async () => {
      const response = await request(app)
        .post('/api/chef/recommendations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ingredients: ['kiwi']
        });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/chef/recipe/:id/tips', () => {
    it('should return recipe tips', async () => {
      const recipe = await Recipe.findOne();
      
      const response = await request(app)
        .get(`/api/chef/recipe/${recipe?.id}/tips`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.tips).toBeInstanceOf(Array);
      expect(response.body.tips).toContain('Use fresh ingredients');
    });
  });
});