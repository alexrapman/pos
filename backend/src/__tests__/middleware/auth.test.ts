// src/__tests__/middleware/auth.test.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware, checkRole } from '../../middleware/auth';

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('authMiddleware', () => {
    it('should return 401 if no token provided', async () => {
      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        error: 'No token provided' 
      });
    });

    it('should call next() with valid token', async () => {
      const token = 'validToken';
      mockRequest.headers = {
        authorization: `Bearer ${token}`
      };

      (jwt.verify as jest.Mock).mockReturnValue({ 
        id: 1, 
        role: 'admin' 
      });

      await authMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('checkRole', () => {
    it('should return 403 for invalid role', () => {
      mockRequest.user = { id: 1, role: 'waiter' };
      
      const middleware = checkRole(['admin']);
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        error: 'Not authorized' 
      });
    });

    it('should call next() for valid role', () => {
      mockRequest.user = { id: 1, role: 'admin' };
      
      const middleware = checkRole(['admin']);
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
    });
  });
});