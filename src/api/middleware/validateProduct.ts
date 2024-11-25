// src/api/middleware/validateProduct.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const productSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    price: z.number().positive('Price must be positive'),
    category: z.string().min(1, 'Category is required'),
    inStock: z.boolean().optional().default(true)
});

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = productSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: 'Validation failed',
                details: error.errors
            });
        } else {
            next(error);
        }
    }
};