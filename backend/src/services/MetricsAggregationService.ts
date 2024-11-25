// backend/src/services/MetricsAggregationService.ts
import { Redis } from 'ioredis';
import { Environment } from '../config/environment';

interface AggregatedMetrics {
    avg: number;
    min: number;
    max: number;
    count: number;
    p95: number;
}

export class MetricsAggregationService {
    private static instance: MetricsAggregationService;
    private redis: Redis;
    private CACHE_TTL = 300; // 5 minutes

    private constructor() {
        const config = Environment.getInstance().config;
        this.redis = new Redis({
            host: config.redis.host,
            port: config.redis.port
        });
    }

    static getInstance(): MetricsAggregationService {
        if (!this.instance) {
            this.instance = new MetricsAggregationService();
        }
        return this.instance;
    }

    async aggregateMetrics(
        metrics: number[],
        interval: '1h' | '1d' | '1w'
    ): Promise<AggregatedMetrics> {
        const cacheKey = `metrics:${interval}:${Date.now()}`;
        const cached = await this.redis.get(cacheKey);

        if (cached) {
            return JSON.parse(cached);
        }

        const sorted = [...metrics].sort((a, b) => a - b);
        const result = {
            avg: this.calculateAverage(metrics),
            min: sorted[0],
            max: sorted[sorted.length - 1],
            count: metrics.length,
            p95: this.calculatePercentile(sorted, 95)
        };

        await this.redis.setex(
            cacheKey,
            this.CACHE_TTL,
            JSON.stringify(result)
        );

        return result;
    }

    private calculateAverage(numbers: number[]): number {
        return numbers.reduce((a, b) => a + b, 0) / numbers.length;
    }

    private calculatePercentile(sorted: number[], p: number): number {
        const index = Math.ceil((p / 100) * sorted.length) - 1;
        return sorted[index];
    }

    async groupMetricsByTime(
        metrics: any[],
        interval: '1h' | '1d' | '1w'
    ) {
        const groups = new Map<string, number[]>();

        metrics.forEach(metric => {
            const timestamp = new Date(metric.timestamp);
            const key = this.getTimeGroupKey(timestamp, interval);
            
            if (!groups.has(key)) {
                groups.set(key, []);
            }
            groups.get(key)?.push(metric.value);
        });

        const result = new Map<string, AggregatedMetrics>();
        
        for (const [key, values] of groups) {
            result.set(key, await this.aggregateMetrics(values, interval));
        }

        return Object.fromEntries(result);
    }

    private getTimeGroupKey(date: Date, interval: string): string {
        switch (interval) {
            case '1h':
                return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
            case '1d':
                return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            case '1w':
                const weekNumber = Math.ceil(date.getDate() / 7);
                return `${date.getFullYear()}-${date.getMonth()}-W${weekNumber}`;
            default:
                throw new Error('Invalid interval');
        }
    }
}