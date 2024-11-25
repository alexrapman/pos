// src/__tests__/auth.test.ts
import request from 'supertest';
import { app } from '../server';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should create a new user and return token', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        role: 'waiter'
      };

      (User.create as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
          role: 'waiter'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token', 'mockToken');
    });
  });

  describe('POST /auth/login', () => {
    it('should login user and return token', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedPassword',
        role: 'waiter'
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });
});