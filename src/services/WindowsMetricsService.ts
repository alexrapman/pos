// src/services/WindowsMetricsService.ts
import { execSync } from 'child_process';
import { EventEmitter } from 'events';

interface SystemMetrics {
    cpuUsage: number;
    memoryUsage: number;
    notificationLatency: number;
    processCount: number;
}

export class WindowsMetricsService extends EventEmitter {
    private metrics: SystemMetrics = {
        cpuUsage: 0,
        memoryUsage: 0,
        notificationLatency: 0,
        processCount: 0
    };

    async collectMetrics(): Promise<SystemMetrics> {
        try {
            const cpuUsage = this.getCPUUsage();
            const memoryUsage = this.getMemoryUsage();
            const processCount = this.getProcessCount();
            const notificationLatency = await this.measureNotificationLatency();

            this.metrics = {
                cpuUsage,
                memoryUsage,
                notificationLatency,
                processCount
            };

            this.emit('metrics', this.metrics);
            return this.metrics;
        } catch (error) {
            console.error('Failed to collect metrics:', error);
            throw error;
        }
    }

    private getCPUUsage(): number {
        const cmd = 'wmic cpu get loadpercentage';
        const output = execSync(cmd).toString();
        const usage = parseInt(output.split('\n')[1]);
        return usage;
    }

    private getMemoryUsage(): number {
        const cmd = 'wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /Value';
        const output = execSync(cmd).toString();
        const total = parseInt(output.match(/TotalVisibleMemorySize=(\d+)/)?.[1] || '0');
        const free = parseInt(output.match(/FreePhysicalMemory=(\d+)/)?.[1] || '0');
        return ((total - free) / total) * 100;
    }

    private getProcessCount(): number {
        const cmd = 'wmic process get processid';
        const output = execSync(cmd).toString();
        return output.split('\n').length - 2;
    }

    private async measureNotificationLatency(): Promise<number> {
        const start = performance.now();
        await new Promise(resolve => {
            const notification = new Notification('Latency Test');
            notification.onshow = resolve;
        });
        return performance.now() - start;
    }
}