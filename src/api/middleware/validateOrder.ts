// src/api/middleware/validateOrder.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { OrderStatus } from '../../models/Order';

const orderItemSchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
    notes: z.string().optional()
});

const createOrderSchema = z.object({
    tableNumber: z.number().int().positive(),
    items: z.array(orderItemSchema).nonempty()
});

const updateOrderSchema = z.object({
    status: z.enum(Object.values(OrderStatus) as [string, ...string[]])
});

export const validateCreateOrder = (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = createOrderSchema.parse(req.body);
        req.body = validatedData;
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

export const validateUpdateOrder = (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = updateOrderSchema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: 'Invalid order status',
                details: error.errors
            });
        } else {
            next(error);
        }
    }
};