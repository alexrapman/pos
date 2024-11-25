// src/api/middleware/permissionMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { PermissionService } from '../../services/PermissionService';

const permissionService = new PermissionService();

export const requirePermission = (permission: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    error: 'Authentication required'
                });
            }

            const hasPermission = await permissionService.hasPermission(
                userId,
                permission
            );

            if (!hasPermission) {
                return res.status(403).json({
                    error: 'Permission denied',
                    required: permission
                });
            }

            next();
        } catch (error) {
            console.error('Permission check failed:', error);
            res.status(500).json({
                error: 'Internal server error during permission check'
            });
        }
    };
};