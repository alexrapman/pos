"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
// src/services/SessionService.ts
const ioredis_1 = require("ioredis");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
class SessionService {
    constructor() {
        this.redis = new ioredis_1.Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379')
        });
    }
    async createSession(userId) {
        const sessionId = (0, uuid_1.v4)();
        const refreshToken = (0, uuid_1.v4)();
        const accessToken = jsonwebtoken_1.default.sign({ userId, sessionId }, process.env.JWT_SECRET, { expiresIn: '15m' });
        // Store refresh token with session data
        await this.redis.set(`session:${sessionId}`, JSON.stringify({ userId, refreshToken }), 'EX', 60 * 60 * 24 * 7 // 7 days
        );
        return { accessToken, refreshToken };
    }
    async refreshSession(refreshToken) {
        const sessions = await this.redis.keys('session:*');
        for (const sessionKey of sessions) {
            const sessionData = await this.redis.get(sessionKey);
            if (!sessionData)
                continue;
            const { userId, refreshToken: storedToken } = JSON.parse(sessionData);
            if (refreshToken === storedToken) {
                const newAccessToken = jsonwebtoken_1.default.sign({ userId, sessionId: sessionKey.split(':')[1] }, process.env.JWT_SECRET, { expiresIn: '15m' });
                return newAccessToken;
            }
        }
        return null;
    }
    async invalidateSession(sessionId) {
        await this.redis.del(`session:${sessionId}`);
    }
}
exports.SessionService = SessionService;
