// backend/src/validators/ReservationValidators.ts
import { ValidationChain, body, param, query } from 'express-validator';
import { isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';

export class ReservationValidators {
  static createReservation(): ValidationChain[] {
    return [
      body('customerName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),

      body('customerEmail')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email address required'),

      body('customerPhone')
        .matches(/^\+?[\d\s-]{10,}$/)
        .withMessage('Valid phone number required'),

      body('date')
        .isISO8601()
        .custom((value) => {
          const reservationDate = new Date(value);
          const now = new Date();
          if (isBefore(reservationDate, now)) {
            throw new Error('Reservation must be for a future date');
          }
          return true;
        }),

      body('duration')
        .isInt({ min: 1, max: 4 })
        .withMessage('Duration must be between 1 and 4 hours'),

      body('partySize')
        .isInt({ min: 1, max: 12 })
        .withMessage('Party size must be between 1 and 12'),

      body('tableId')
        .isInt()
        .withMessage('Valid table ID required')
    ];
  }

  static queryReservations(): ValidationChain[] {
    return [
      query('startDate')
        .optional()
        .isISO8601()
        .custom((value) => {
          const date = new Date(value);
          return !isNaN(date.getTime());
        })
        .withMessage('Invalid start date'),

      query('endDate')
        .optional()
        .isISO8601()
        .custom((value, { req }) => {
          const endDate = new Date(value);
          const startDate = new Date(req.query.startDate);
          if (isBefore(endDate, startDate)) {
            throw new Error('End date must be after start date');
          }
          return true;
        })
        .withMessage('Invalid end date'),

      query('status')
        .optional()
        .isIn(['confirmed', 'cancelled', 'completed'])
        .withMessage('Invalid status')
    ];
  }

  static updateReservation(): ValidationChain[] {
    return [
      param('id').isInt().withMessage('Valid reservation ID required'),
      ...this.createReservation().map(validator => 
        validator.optional()
      )
    ];
  }

  static validateTimeSlot(): ValidationChain[] {
    return [
      body('tableId').isInt().withMessage('Valid table ID required'),
      body('date').isISO8601().withMessage('Valid date required'),
      body('duration')
        .isInt({ min: 1, max: 4 })
        .withMessage('Duration must be between 1 and 4 hours')
    ];
  }
}