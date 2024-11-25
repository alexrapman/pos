// src/services/PerformanceMetricsCollector.ts
import { EventEmitter } from 'events';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface PerformanceMetric {
    timestamp: number;
    cpu: number;
    memory: number;
    diskIO: number;
    networkLatency: number;
    notificationLatency: number;
}

export class PerformanceMetricsCollector extends EventEmitter {
    private metrics: PerformanceMetric[] = [];
    private readonly dataPath: string;
    private collectionInterval: NodeJS.Timeout | null = null;

    constructor() {
        super();
        this.dataPath = path.join(process.env.APPDATA!, 'RestaurantPOS', 'performance.json');
        this.loadHistoricalData();
    }

    startCollection(intervalMs: number = 1000): void {
        if (this.collectionInterval) return;

        this.collectionInterval = setInterval(async () => {
            const metric = await this.collectMetrics();
            this.metrics.push(metric);
            this.emit('metrics', metric);
            this.saveHistoricalData();
        }, intervalMs);
    }

    private async collectMetrics(): Promise<PerformanceMetric> {
        return {
            timestamp: Date.now(),
            cpu: await this.getCPUUsage(),
            memory: await this.getMemoryUsage(),
            diskIO: await this.getDiskIO(),
            networkLatency: await this.getNetworkLatency(),
            notificationLatency: await this.getNotificationLatency()
        };
    }

    private async getCPUUsage(): Promise<number> {
        const output = execSync('wmic cpu get loadpercentage').toString();
        return parseInt(output.split('\n')[1]);
    }

    private async getMemoryUsage(): Promise<number> {
        const output = execSync('wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /Value').toString();
        const total = parseInt(output.match(/TotalVisibleMemorySize=(\d+)/)?.[1] || '0');
        const free = parseInt(output.match(/FreePhysicalMemory=(\d+)/)?.[1] || '0');
        return ((total - free) / total) * 100;
    }

    private async getDiskIO(): Promise<number> {
        const output = execSync('typeperf "\\PhysicalDisk(_Total)\\Disk Transfers/sec" -sc 1').toString();
        const lines = output.split('\n');
        return parseFloat(lines[2].split(',')[1]);
    }

    private async getNetworkLatency(): Promise<number> {
        const output = execSync('ping 8.8.8.8 -n 1').toString();
        const match = output.match(/Average = (\d+)ms/);
        return match ? parseInt(match[1]) : 0;
    }

    private async getNotificationLatency(): Promise<number> {
        const start = performance.now();
        const notification = new Notification('Test');
        await new Promise(resolve => notification.onshow = resolve);
        return performance.now() - start;
    }

    private loadHistoricalData(): void {
        try {
            if (existsSync(this.dataPath)) {
                const data = readFileSync(this.dataPath, 'utf8');
                this.metrics = JSON.parse(data);
            }
        } catch (error) {
            console.error('Failed to load historical data:', error);
        }
    }

    private saveHistoricalData(): void {
        try {
            writeFileSync(this.dataPath, JSON.stringify(this.metrics));
        } catch (error) {
            console.error('Failed to save historical data:', error);
        }
    }
}