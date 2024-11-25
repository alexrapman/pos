"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionCleanupService = void 0;
// src/services/SessionCleanupService.ts
const ioredis_1 = require("ioredis");
const worker_threads_1 = require("worker_threads");
const logger_1 = require("../utils/logger");
class SessionCleanupService {
    constructor() {
        this.redis = new ioredis_1.Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379')
        });
        this.initializeWorker();
    }
    initializeWorker() {
        this.worker = new worker_threads_1.Worker(`
            const { parentPort } = require('worker_threads');
            const interval = setInterval(async () => {
                parentPort?.postMessage('cleanup');
            }, 1000 * 60 * 60); // Run every hour
        `);
        this.worker.on('message', async () => {
            await this.cleanup();
        });
    }
    async cleanup() {
        try {
            const sessions = await this.redis.keys('session:*');
            for (const sessionKey of sessions) {
                const sessionData = await this.redis.get(sessionKey);
                if (!sessionData)
                    continue;
                const { expiresAt } = JSON.parse(sessionData);
                if (new Date(expiresAt) < new Date()) {
                    await this.redis.del(sessionKey);
                    logger_1.logger.info(`Cleaned up expired session: ${sessionKey}`);
                }
            }
        }
        catch (error) {
            logger_1.logger.error('Session cleanup failed:', error);
        }
    }
    async getSessionStats() {
        const sessions = await this.redis.keys('session:*');
        const activeSessions = sessions.length;
        return {
            activeSessions,
            timestamp: new Date().toISOString()
        };
    }
}
exports.SessionCleanupService = SessionCleanupService;
