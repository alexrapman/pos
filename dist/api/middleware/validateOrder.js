"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateOrder = exports.validateCreateOrder = void 0;
const zod_1 = require("zod");
const Order_1 = require("../../models/Order");
const orderItemSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid(),
    quantity: zod_1.z.number().int().positive(),
    notes: zod_1.z.string().optional()
});
const createOrderSchema = zod_1.z.object({
    tableNumber: zod_1.z.number().int().positive(),
    items: zod_1.z.array(orderItemSchema).nonempty()
});
const updateOrderSchema = zod_1.z.object({
    status: zod_1.z.enum(Object.values(Order_1.OrderStatus))
});
const validateCreateOrder = (req, res, next) => {
    try {
        const validatedData = createOrderSchema.parse(req.body);
        req.body = validatedData;
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
exports.validateCreateOrder = validateCreateOrder;
const validateUpdateOrder = (req, res, next) => {
    try {
        const validatedData = updateOrderSchema.parse(req.body);
        req.body = validatedData;
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                error: 'Invalid order status',
                details: error.errors
            });
        }
        else {
            next(error);
        }
    }
};
exports.validateUpdateOrder = validateUpdateOrder;
