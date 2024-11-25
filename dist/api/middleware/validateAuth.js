"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuth = void 0;
const zod_1 = require("zod");
const User_1 = require("../../models/User");
const loginSchema = zod_1.z.object({
    username: zod_1.z.string().min(3),
    password: zod_1.z.string().min(6)
});
const registerSchema = loginSchema.extend({
    role: zod_1.z.enum(Object.values(User_1.UserRole))
});
const validateAuth = (req, res, next) => {
    try {
        const schema = req.path.includes('login') ? loginSchema : registerSchema;
        req.body = schema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                error: 'Validation failed',
                details: error.errors
            });
        }
        else {
            next(error);
        }
    }
};
exports.validateAuth = validateAuth;
