// src/api/middleware/roleMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../models/User';

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: UserRole;
    };
}

export const authorize = (allowedRoles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized - No user found' });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    error: 'Forbidden - Insufficient permissions',
                    required: allowedRoles,
                    current: req.user.role
                });
            }

            next();
        } catch (error) {
            console.error('Role authorization error:', error);
            res.status(500).json({ error: 'Internal server error during authorization' });
        }
    };
};