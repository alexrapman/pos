// src/services/HistoricalDataAnalyzer.ts
import { PerformanceMetric } from './PerformanceMetricsCollector';
import { subHours, subDays, format } from 'date-fns';

export class HistoricalDataAnalyzer {
    analyzeMetrics(metrics: PerformanceMetric[], timeRange: string) {
        const filteredMetrics = this.filterByTimeRange(metrics, timeRange);
        return {
            trends: this.calculateTrends(filteredMetrics),
            averages: this.calculateAverages(filteredMetrics),
            peaks: this.findPeakValues(filteredMetrics),
            anomalies: this.detectAnomalies(filteredMetrics)
        };
    }

    private filterByTimeRange(metrics: PerformanceMetric[], timeRange: string): PerformanceMetric[] {
        const now = new Date();
        const cutoff = timeRange === '1h' ? subHours(now, 1) :
            timeRange === '24h' ? subDays(now, 1) :
                subDays(now, 7);

        return metrics.filter(m => m.timestamp >= cutoff.getTime());
    }

    private calculateTrends(metrics: PerformanceMetric[]) {
        return {
            cpu: this.calculateLinearRegression(metrics.map(m => m.cpu)),
            memory: this.calculateLinearRegression(metrics.map(m => m.memory)),
            networkLatency: this.calculateLinearRegression(metrics.map(m => m.networkLatency))
        };
    }

    private calculateLinearRegression(values: number[]) {
        const n = values.length;
        const x = Array.from({ length: n }, (_, i) => i);
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = values.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return {
            slope,
            direction: slope > 0 ? 'increasing' : 'decreasing'
        };
    }

    private calculateAverages(metrics: PerformanceMetric[]) {
        return {
            cpu: this.average(metrics.map(m => m.cpu)),
            memory: this.average(metrics.map(m => m.memory)),
            networkLatency: this.average(metrics.map(m => m.networkLatency)),
            notificationLatency: this.average(metrics.map(m => m.notificationLatency))
        };
    }

    private average(values: number[]): number {
        return values.reduce((a, b) => a + b, 0) / values.length;
    }

    private findPeakValues(metrics: PerformanceMetric[]) {
        return {
            cpu: Math.max(...metrics.map(m => m.cpu)),
            memory: Math.max(...metrics.map(m => m.memory)),
            networkLatency: Math.max(...metrics.map(m => m.networkLatency))
        };
    }

    private detectAnomalies(metrics: PerformanceMetric[]) {
        return {
            cpu: this.findAnomalies(metrics.map(m => m.cpu)),
            memory: this.findAnomalies(metrics.map(m => m.memory)),
            networkLatency: this.findAnomalies(metrics.map(m => m.networkLatency))
        };
    }

    private findAnomalies(values: number[]) {
        const mean = this.average(values);
        const stdDev = Math.sqrt(this.average(values.map(x => (x - mean) ** 2)));
        return values.filter(x => Math.abs(x - mean) > 2 * stdDev);
    }
}