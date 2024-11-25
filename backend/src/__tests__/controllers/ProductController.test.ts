// src/__tests__/controllers/ProductController.test.ts
import { Request, Response } from 'express';
import { ProductController } from '../../controllers/ProductController';
import { Product } from '../../models/Product';

jest.mock('../../models/Product');

describe('ProductController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let productController: ProductController;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    productController = new ProductController();
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all products', async () => {
      const mockProducts = [
        { id: 1, name: 'Pizza', price: 10 },
        { id: 2, name: 'Burger', price: 8 }
      ];

      (Product.findAll as jest.Mock).mockResolvedValue(mockProducts);

      await productController.getAll(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockProducts);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const mockProduct = { id: 1, name: 'Pizza', price: 10 };
      mockRequest.body = mockProduct;

      (Product.create as jest.Mock).mockResolvedValue(mockProduct);

      await productController.create(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockProduct);
    });
  });
});
