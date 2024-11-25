// backend/src/services/AnalyticsAggregator.ts
import { Order } from '../models/Order';
import { RedisCacheService } from './RedisCacheService';

export class AnalyticsAggregator {
    private cache: RedisCacheService;

    constructor() {
        this.cache = new RedisCacheService();
    }

    async getAggregatedMetrics(timeRange: string) {
        const cacheKey = `metrics-${timeRange}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) return cached;

        const metrics = await this.calculateMetrics(timeRange);
        await this.cache.set(cacheKey, metrics);
        return metrics;
    }

    private async calculateMetrics(timeRange: string) {
        const orders = await Order.findAll({
            where: this.getTimeRangeFilter(timeRange)
        });

        return {
            revenue: this.calculateRevenue(orders),
            orderCount: orders.length,
            averageOrderValue: this.calculateAOV(orders)
        };
    }
}