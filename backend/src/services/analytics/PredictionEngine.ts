// backend/src/services/analytics/PredictionEngine.ts
import { Order } from '../../models/Order';
import { groupBy, mean, std } from 'lodash';

export class PredictionEngine {
    private historicalOrders: Order[];

    constructor(orders: Order[]) {
        this.historicalOrders = orders;
    }

    public revenueForcast(): RevenuePrediction {
        const dailyRevenue = this.getDailyRevenue();
        const trend = this.calculateTrend(dailyRevenue);

        return {
            nextDay: trend.average + trend.slope,
            nextWeek: (trend.average + trend.slope) * 7,
            confidence: this.calculateConfidence(dailyRevenue)
        };
    }

    public peakHoursAnalysis(): PeakHours[] {
        const hourlyOrders = this.getHourlyOrderDistribution();
        return Object.entries(hourlyOrders)
            .map(([hour, count]) => ({
                hour: parseInt(hour),
                orderCount: count,
                isHighTraffic: count > mean(Object.values(hourlyOrders)) + std(Object.values(hourlyOrders))
            }))
            .sort((a, b) => b.orderCount - a.orderCount);
    }

    public inventoryOptimization(): InventoryPrediction[] {
        const itemUsage = this.getItemUsagePatterns();
        return Object.entries(itemUsage).map(([itemId, usage]) => ({
            itemId,
            suggestedStock: this.calculateOptimalStock(usage),
            reorderPoint: this.calculateReorderPoint(usage),
            confidenceLevel: this.calculateConfidence(usage)
        }));
    }

    private calculateTrend(data: number[]): TrendAnalysis {
        // Linear regression implementation
        const n = data.length;
        const x = Array.from({ length: n }, (_, i) => i);
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = data.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * data[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const average = sumY / n;

        return { slope, average };
    }

    private calculateConfidence(data: number[]): number {
        const stdDev = std(data);
        const mean = mean(data);
        return Math.max(0, Math.min(1, 1 - (stdDev / mean)));
    }
}