// backend/src/middleware/validateRequest.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

// Custom validators
export const reservationValidators = {
  dateTime: () => ({
    in: ['body'],
    errorMessage: 'Invalid date/time',
    isISO8601: true,
    custom: {
      options: (value: string) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format');
        }
        if (date < new Date()) {
          throw new Error('Date must be in the future');
        }
        return true;
      }
    }
  }),

  duration: () => ({
    in: ['body'],
    errorMessage: 'Invalid duration',
    isInt: {
      options: { min: 1, max: 4 },
      errorMessage: 'Duration must be between 1 and 4 hours'
    }
  }),

  partySize: () => ({
    in: ['body'],
    errorMessage: 'Invalid party size',
    isInt: {
      options: { min: 1, max: 12 },
      errorMessage: 'Party size must be between 1 and 12'
    }
  }),

  tableId: () => ({
    in: ['body'],
    errorMessage: 'Invalid table ID',
    isInt: true
  })
};