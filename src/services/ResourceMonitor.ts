// src/services/ResourceMonitor.ts
import { EventEmitter } from 'events';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface SystemMetrics {
    memoryUsage: number;
    cpuUsage: number;
    diskSpace: number;
    processMemory: number;
}

export class ResourceMonitor extends EventEmitter {
    private interval: NodeJS.Timeout | null = null;
    private readonly WARNING_THRESHOLD = 0.8; // 80%
    private readonly CRITICAL_THRESHOLD = 0.9; // 90%

    async startMonitoring(intervalMs: number = 5000): Promise<void> {
        this.interval = setInterval(async () => {
            const metrics = await this.collectMetrics();
            this.emit('metrics', metrics);
            this.checkThresholds(metrics);
        }, intervalMs);
    }

    private async collectMetrics(): Promise<SystemMetrics> {
        const [memoryUsage, cpuUsage, diskSpace] = await Promise.all([
            this.getMemoryUsage(),
            this.getCPUUsage(),
            this.getDiskSpace()
        ]);

        return {
            memoryUsage,
            cpuUsage,
            diskSpace,
            processMemory: process.memoryUsage().heapUsed / 1024 / 1024
        };
    }

    private async getMemoryUsage(): Promise<number> {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        return (totalMem - freeMem) / totalMem;
    }

    private async getCPUUsage(): Promise<number> {
        const { stdout } = await execAsync('wmic cpu get loadpercentage');
        const usage = parseInt(stdout.split('\n')[1]);
        return usage / 100;
    }

    private async getDiskSpace(): Promise<number> {
        const { stdout } = await execAsync('wmic logicaldisk get size,freespace');
        const lines = stdout.split('\n').filter(line => line.trim());
        let totalSize = 0;
        let totalFree = 0;

        lines.slice(1).forEach(line => {
            const [free, size] = line.trim().split(/\s+/).map(Number);
            if (!isNaN(free) && !isNaN(size)) {
                totalFree += free;
                totalSize += size;
            }
        });

        return (totalSize - totalFree) / totalSize;
    }

    private checkThresholds(metrics: SystemMetrics): void {
        Object.entries(metrics).forEach(([metric, value]) => {
            if (value > this.CRITICAL_THRESHOLD) {
                this.emit('alert', {
                    level: 'critical',
                    metric,
                    value
                });
            } else if (value > this.WARNING_THRESHOLD) {
                this.emit('alert', {
                    level: 'warning',
                    metric,
                    value
                });
            }
        });
    }

    stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}