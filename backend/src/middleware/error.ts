// backend/src/middleware/error.ts
import { Request, Response, NextFunction } from 'express';

// Custom error classes
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  if (err === null || err === undefined) {
    return res.status(500).json({
      status: 'error',
      message: 'Null pointer exception'
    });
  }

  if (err instanceof TypeError) {
    return res.status(500).json({
      status: 'error',
      message: 'Type error'
    });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: (err as any).errors.map((e: any) => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Default error response
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};
