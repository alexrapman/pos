// src/services/SessionCleanupService.ts
import { Redis } from 'ioredis';
import { Worker } from 'worker_threads';
import { logger } from '../utils/logger';

export class SessionCleanupService {
    private redis: Redis;
    private worker: Worker;

    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379')
        });

        this.initializeWorker();
    }

    private initializeWorker() {
        this.worker = new Worker(`
            const { parentPort } = require('worker_threads');
            const interval = setInterval(async () => {
                parentPort?.postMessage('cleanup');
            }, 1000 * 60 * 60); // Run every hour
        `);

        this.worker.on('message', async () => {
            await this.cleanup();
        });
    }

    private async cleanup() {
        try {
            const sessions = await this.redis.keys('session:*');
            for (const sessionKey of sessions) {
                const sessionData = await this.redis.get(sessionKey);
                if (!sessionData) continue;

                const { expiresAt } = JSON.parse(sessionData);
                if (new Date(expiresAt) < new Date()) {
                    await this.redis.del(sessionKey);
                    logger.info(`Cleaned up expired session: ${sessionKey}`);
                }
            }
        } catch (error) {
            logger.error('Session cleanup failed:', error);
        }
    }

    async getSessionStats(): Promise<SessionStats> {
        const sessions = await this.redis.keys('session:*');
        const activeSessions = sessions.length;

        return {
            activeSessions,
            timestamp: new Date().toISOString()
        };
    }
}