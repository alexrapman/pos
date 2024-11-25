"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const ioredis_1 = require("ioredis");
const SessionService_1 = require("../../services/SessionService");
const redis = new ioredis_1.Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
});
const rateLimiter = new rate_limiter_flexible_1.RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'middleware',
    points: 10, // Number of requests
    duration: 1 // Per second
});
const sessionMiddleware = async (req, res, next) => {
    try {
        // Rate limiting
        await rateLimiter.consume(req.ip);
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const sessionService = new SessionService_1.SessionService();
        const session = await sessionService.validateSession(token);
        if (!session) {
            return res.status(401).json({ error: 'Invalid session' });
        }
        req.sessionId = session.sessionId;
        req.userId = session.userId;
        next();
    }
    catch (error) {
        if (error.name === 'RateLimiterError') {
            return res.status(429).json({ error: 'Too many requests' });
        }
        next(error);
    }
};
exports.sessionMiddleware = sessionMiddleware;
