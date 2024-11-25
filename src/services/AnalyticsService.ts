// src/services/AnalyticsService.ts
import { Order, OrderStatus } from '../models/Order';
import { Redis } from 'ioredis';

export class AnalyticsService {
    private redis: Redis;

    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379')
        });
    }

    async getAnalytics(timeRange: 'day' | 'week' | 'month'): Promise<{
        averageCompletionTime: number;
        ordersByHour: number[];
        popularItems: Array<{ name: string; count: number }>;
        peakHours: number[];
    }> {
        const cacheKey = `analytics:${timeRange}`;
        const cached = await this.redis.get(cacheKey);

        if (cached) {
            return JSON.parse(cached);
        }

        const orders = await this.getOrdersForTimeRange(timeRange);
        const analytics = {
            averageCompletionTime: this.calculateAverageCompletionTime(orders),
            ordersByHour: this.calculateOrdersByHour(orders),
            popularItems: this.calculatePopularItems(orders),
            peakHours: this.identifyPeakHours(orders)
        };

        // Cache for 5 minutes
        await this.redis.setex(cacheKey, 300, JSON.stringify(analytics));

        return analytics;
    }

    private calculateAverageCompletionTime(orders: Order[]): number {
        const completionTimes = orders
            .filter(order => order.status === OrderStatus.DELIVERED)
            .map(order =>
                new Date(order.completedAt!).getTime() - new Date(order.createdAt).getTime()
            );

        return completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length / 1000 / 60;
    }

    private calculateOrdersByHour(orders: Order[]): number[] {
        const hourCounts = new Array(24).fill(0);
        orders.forEach(order => {
            const hour = new Date(order.createdAt).getHours();
            hourCounts[hour]++;
        });
        return hourCounts;
    }

    private calculatePopularItems(orders: Order[]): Array<{ name: string; count: number }> {
        const itemCounts = orders.reduce((acc, order) => {
            order.items.forEach(item => {
                acc[item.name] = (acc[item.name] || 0) + item.quantity;
            });
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(itemCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }
}