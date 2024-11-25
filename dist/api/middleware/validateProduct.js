"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProduct = void 0;
const zod_1 = require("zod");
const productSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Product name is required'),
    price: zod_1.z.number().positive('Price must be positive'),
    category: zod_1.z.string().min(1, 'Category is required'),
    inStock: zod_1.z.boolean().optional().default(true)
});
const validateProduct = (req, res, next) => {
    try {
        req.body = productSchema.parse(req.body);
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
exports.validateProduct = validateProduct;
