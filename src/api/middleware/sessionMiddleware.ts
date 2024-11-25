// src/api/middleware/sessionMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { Redis } from 'ioredis';
import { SessionService } from '../../services/SessionService';

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
});

const rateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'middleware',
    points: 10, // Number of requests
    duration: 1 // Per second
});

export interface SessionRequest extends Request {
    sessionId?: string;
    userId?: string;
}

export const sessionMiddleware = async (
    req: SessionRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // Rate limiting
        await rateLimiter.consume(req.ip);

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const sessionService = new SessionService();
        const session = await sessionService.validateSession(token);

        if (!session) {
            return res.status(401).json({ error: 'Invalid session' });
        }

        req.sessionId = session.sessionId;
        req.userId = session.userId;

        next();
    } catch (error) {
        if (error.name === 'RateLimiterError') {
            return res.status(429).json({ error: 'Too many requests' });
        }
        next(error);
    }
};