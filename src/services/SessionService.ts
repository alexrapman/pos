// src/services/SessionService.ts
import { Redis } from 'ioredis';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export class SessionService {
    private redis: Redis;

    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379')
        });
    }

    async createSession(userId: string): Promise<{ accessToken: string, refreshToken: string }> {
        const sessionId = uuidv4();
        const refreshToken = uuidv4();

        const accessToken = jwt.sign(
            { userId, sessionId },
            process.env.JWT_SECRET!,
            { expiresIn: '15m' }
        );

        // Store refresh token with session data
        await this.redis.set(
            `session:${sessionId}`,
            JSON.stringify({ userId, refreshToken }),
            'EX',
            60 * 60 * 24 * 7 // 7 days
        );

        return { accessToken, refreshToken };
    }

    async refreshSession(refreshToken: string): Promise<string | null> {
        const sessions = await this.redis.keys('session:*');

        for (const sessionKey of sessions) {
            const sessionData = await this.redis.get(sessionKey);
            if (!sessionData) continue;

            const { userId, refreshToken: storedToken } = JSON.parse(sessionData);
            if (refreshToken === storedToken) {
                const newAccessToken = jwt.sign(
                    { userId, sessionId: sessionKey.split(':')[1] },
                    process.env.JWT_SECRET!,
                    { expiresIn: '15m' }
                );
                return newAccessToken;
            }
        }

        return null;
    }

    async invalidateSession(sessionId: string): Promise<void> {
        await this.redis.del(`session:${sessionId}`);
    }
}