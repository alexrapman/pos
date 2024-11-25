// src/api/middleware/validateAuth.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { UserRole } from '../../models/User';

const loginSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6)
});

const registerSchema = loginSchema.extend({
    role: z.enum(Object.values(UserRole) as [string, ...string[]])
});

export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = req.path.includes('login') ? loginSchema : registerSchema;
        req.body = schema.parse(req.body);
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