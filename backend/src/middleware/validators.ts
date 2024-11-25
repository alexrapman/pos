// backend/src/middleware/validators.ts
import { Request, Response, NextFunction } from 'express';
import { isValid, parseISO } from 'date-fns';
import { body, param, query, validationResult } from 'express-validator';

export const validateDateRange = (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({
            error: 'Se requieren fechas de inicio y fin'
        });
    }

    if (!isValid(parseISO(startDate as string)) || !isValid(parseISO(endDate as string))) {
        return res.status(400).json({
            error: 'Formato de fecha inválido. Use YYYY-MM-DD'
        });
    }

    if (parseISO(startDate as string) > parseISO(endDate as string)) {
        return res.status(400).json({
            error: 'La fecha de inicio debe ser anterior a la fecha de fin'
        });
    }

    next();
};

export const validateOrderId = (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;

    if (!orderId || !orderId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            error: 'ID de pedido inválido'
        });
    }

    next();
};

export const validateEmailReceipt = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
            error: 'Dirección de correo electrónico inválida'
        });
    }

    next();
};

export const checkReceiptPermissions = (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;
    const allowedRoles = ['admin', 'waiter'];

    if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({
            error: 'No tiene permisos para acceder a los recibos'
        });
    }

    next();
};

export const validateOrder = [
  body('tableId')
    .isInt()
    .withMessage('Table ID must be a number'),
  body('items')
    .isArray()
    .withMessage('Items must be an array')
    .notEmpty()
    .withMessage('Order must contain items'),
  body('items.*.productId')
    .isInt()
    .withMessage('Product ID must be a number'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  validateRequest
];

export const validateTable = [
  body('number')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Table number is required'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be at least 1'),
  body('status')
    .optional()
    .isIn(['available', 'occupied', 'reserved'])
    .withMessage('Invalid table status'),
  validateRequest
];

export const validateStatus = [
  param('id')
    .isInt()
    .withMessage('Invalid ID'),
  body('status')
    .isIn(['pending', 'preparing', 'ready', 'delivered'])
    .withMessage('Invalid status'),
  validateRequest
];

export const validateAvailability = [
  query('date')
    .isISO8601()
    .withMessage('Invalid date format'),
  query('partySize')
    .isInt({ min: 1 })
    .withMessage('Party size must be at least 1'),
  validateRequest
];

// Validation middleware
const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};