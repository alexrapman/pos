// src/services/SystemMonitorService.ts
import os from 'os';
import { EventEmitter } from 'events';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface SystemMetrics {
    cpu: number;
    memory: {
        total: number;
        used: number;
        free: number;
    };
    disk: {
        total: number;
        used: number;
        free: number;
    };
    network: {
        bytesIn: number;
        bytesOut: number;
    };
}

export class SystemMonitorService extends EventEmitter {
    private interval: NodeJS.Timeout | null = null;
    private readonly ALERT_THRESHOLDS = {
        cpu: 80,
        memory: 85,
        disk: 90
    };

    async startMonitoring(intervalMs: number = 5000): Promise<void> {
        this.interval = setInterval(async () => {
            try {
                const metrics = await this.collectMetrics();
                this.emit('metrics', metrics);
                this.checkThresholds(metrics);
            } catch (error) {
                this.emit('error', error);
            }
        }, intervalMs);
    }

    private async collectMetrics(): Promise<SystemMetrics> {
        const [diskInfo, networkInfo] = await Promise.all([
            this.getDiskInfo(),
            this.getNetworkInfo()
        ]);

        return {
            cpu: await this.getCPUUsage(),
            memory: this.getMemoryInfo(),
            disk: diskInfo,
            network: networkInfo
        };
    }

    private async getCPUUsage(): Promise<number> {
        const { stdout } = await execAsync('wmic cpu get loadpercentage');
        const usage = parseInt(stdout.split('\n')[1]);
        return usage;
    }

    private getMemoryInfo() {
        const total = os.totalmem();
        const free = os.freemem();
        const used = total - free;

        return {
            total,
            used,
            free
        };
    }

    private async getDiskInfo() {
        const { stdout } = await execAsync('wmic logicaldisk get size,freespace');
        const lines = stdout.split('\n').filter(line => line.trim());
        let total = 0;
        let free = 0;

        lines.slice(1).forEach(line => {
            const [freeSpace, size] = line.trim().split(/\s+/).map(Number);
            if (!isNaN(freeSpace) && !isNaN(size)) {
                free += freeSpace;
                total += size;
            }
        });

        return {
            total,
            free,
            used: total - free
        };
    }

    private async getNetworkInfo() {
        const { stdout } = await execAsync('netstat -e');
        const lines = stdout.split('\n');
        const values = lines[1].trim().split(/\s+/);

        return {
            bytesIn: parseInt(values[1]),
            bytesOut: parseInt(values[2])
        };
    }

    private checkThresholds(metrics: SystemMetrics): void {
        if (metrics.cpu > this.ALERT_THRESHOLDS.cpu) {
            this.emit('alert', {
                type: 'cpu',
                value: metrics.cpu,
                threshold: this.ALERT_THRESHOLDS.cpu
            });
        }

        const memoryUsage = (metrics.memory.used / metrics.memory.total) * 100;
        if (memoryUsage > this.ALERT_THRESHOLDS.memory) {
            this.emit('alert', {
                type: 'memory',
                value: memoryUsage,
                threshold: this.ALERT_THRESHOLDS.memory
            });
        }

        const diskUsage = (metrics.disk.used / metrics.disk.total) * 100;
        if (diskUsage > this.ALERT_THRESHOLDS.disk) {
            this.emit('alert', {
                type: 'disk',
                value: diskUsage,
                threshold: this.ALERT_THRESHOLDS.disk
            });
        }
    }

    stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}