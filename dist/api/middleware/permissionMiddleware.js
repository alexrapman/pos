"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = void 0;
const PermissionService_1 = require("../../services/PermissionService");
const permissionService = new PermissionService_1.PermissionService();
const requirePermission = (permission) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    error: 'Authentication required'
                });
            }
            const hasPermission = await permissionService.hasPermission(userId, permission);
            if (!hasPermission) {
                return res.status(403).json({
                    error: 'Permission denied',
                    required: permission
                });
            }
            next();
        }
        catch (error) {
            console.error('Permission check failed:', error);
            res.status(500).json({
                error: 'Internal server error during permission check'
            });
        }
    };
};
exports.requirePermission = requirePermission;
