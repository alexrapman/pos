// backend/src/services/MetricsCollectionService.ts
import { EventEmitter } from 'events';
import { Database } from '../config/database';
import { io } from '../socket';

export class MetricsCollectionService {
    private static instance: MetricsCollectionService;
    private collectionInterval: NodeJS.Timer;
    private readonly COLLECTION_INTERVAL = 5000; // 5 seconds

    private constructor() {
        this.startCollection();
    }

    static getInstance(): MetricsCollectionService {
        if (!this.instance) {
            this.instance = new MetricsCollectionService();
        }
        return this.instance;
    }

    private async collectMetrics() {
        const metrics = {
            timestamp: Date.now(),
            responseTime: this.calculateAverageResponseTime(),
            requestCount: this.getRequestCount(),
            memoryUsage: process.memoryUsage().heapUsed,
            cpuUsage: process.cpuUsage(),
            activeConnections: io.engine.clientsCount
        };

        await this.storeMetrics(metrics);
        this.broadcastMetrics(metrics);
    }

    private async storeMetrics(metrics: any) {
        const query = `
            INSERT INTO metrics (
                timestamp, response_time, request_count, 
                memory_usage, cpu_usage, active_connections
            ) VALUES ($1, $2, $3, $4, $5, $6)
        `;

        await Database.getInstance().query(query, [
            metrics.timestamp,
            metrics.responseTime,
            metrics.requestCount,
            metrics.memoryUsage,
            JSON.stringify(metrics.cpuUsage),
            metrics.activeConnections
        ]);
    }

    private broadcastMetrics(metrics: any) {
        io.emit('metrics', metrics);
    }

    private startCollection() {
        this.collectionInterval = setInterval(
            () => this.collectMetrics(),
            this.COLLECTION_INTERVAL
        );
    }

    async getHistoricalMetrics(
        startTime: Date,
        endTime: Date
    ) {
        const query = `
            SELECT * FROM metrics 
            WHERE timestamp BETWEEN $1 AND $2 
            ORDER BY timestamp ASC
        `;
        
        return await Database.getInstance().query(query, [
            startTime,
            endTime
        ]);
    }

    stopCollection() {
        if (this.collectionInterval) {
            clearInterval(this.collectionInterval);
        }
    }
}