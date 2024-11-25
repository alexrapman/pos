/ backend/src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const inventoryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite por IP
  message: 'Too many requests from this IP'
});