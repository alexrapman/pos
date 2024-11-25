// backend/src/middleware/logging.ts
import winston from 'winston';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Configure Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const traceId = uuidv4();
  req.traceId = traceId;

  // Log request
  logger.info('Request received', {
    traceId,
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Log response
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('Response sent', {
      traceId,
      statusCode: res.statusCode,
      duration,
      path: req.path
    });
  });

  next();
};

export { logger };