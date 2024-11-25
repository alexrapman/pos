"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (allowedRoles) => {
    return (req, res, next) => {
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
        }
        catch (error) {
            console.error('Role authorization error:', error);
            res.status(500).json({ error: 'Internal server error during authorization' });
        }
    };
};
exports.authorize = authorize;
