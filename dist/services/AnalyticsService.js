"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
// src/services/AnalyticsService.ts
const Order_1 = require("../models/Order");
const ioredis_1 = require("ioredis");
class AnalyticsService {
    constructor() {
        this.redis = new ioredis_1.Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379')
        });
    }
    async getAnalytics(timeRange) {
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
    calculateAverageCompletionTime(orders) {
        const completionTimes = orders
            .filter(order => order.status === Order_1.OrderStatus.DELIVERED)
            .map(order => new Date(order.completedAt).getTime() - new Date(order.createdAt).getTime());
        return completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length / 1000 / 60;
    }
    calculateOrdersByHour(orders) {
        const hourCounts = new Array(24).fill(0);
        orders.forEach(order => {
            const hour = new Date(order.createdAt).getHours();
            hourCounts[hour]++;
        });
        return hourCounts;
    }
    calculatePopularItems(orders) {
        const itemCounts = orders.reduce((acc, order) => {
            order.items.forEach(item => {
                acc[item.name] = (acc[item.name] || 0) + item.quantity;
            });
            return acc;
        }, {});
        return Object.entries(itemCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }
}
exports.AnalyticsService = AnalyticsService;
