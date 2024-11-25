// src/services/WindowsSystemMonitor.ts
import { BrowserWindow } from 'electron';
import * as os from 'os';
import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import { WindowsAlertService, AlertSeverity } from './WindowsAlertService';

interface SystemMetrics {
    cpu: number;
    memory: number;
    disk: number;
    network: boolean;
    temperature: number;
}

export class WindowsSystemMonitor extends EventEmitter {
    private window: BrowserWindow;
    private metrics: SystemMetrics;
    private intervalId: NodeJS.Timeout | null = null;
    private readonly ALERT_THRESHOLDS = {
        cpu: 80,
        memory: 85,
        disk: 90,
        temperature: 75
    };
    private alertService: WindowsAlertService;
    private alertHistory: Map<string, number> = new Map();
    private readonly ALERT_COOLDOWN = 5 * 60 * 1000; // 5 minutes

    constructor(window: BrowserWindow) {
        super();
        this.window = window;
        this.metrics = {
            cpu: 0,
            memory: 0,
            disk: 0,
            network: true,
            temperature: 0
        };
        this.alertService = new WindowsAlertService();
    }

    public startMonitoring(interval: number = 5000): void {
        this.intervalId = setInterval(async () => {
            await this.updateMetrics();
            this.checkThresholds();
            this.window.webContents.send('system-metrics', this.metrics);
        }, interval);
    }

    private async updateMetrics(): Promise<void> {
        this.metrics = {
            cpu: await this.getCPUUsage(),
            memory: this.getMemoryUsage(),
            disk: await this.getDiskUsage(),
            network: await this.checkNetworkConnection(),
            temperature: await this.getCPUTemperature()
        };
    }

    private async getCPUUsage(): Promise<number> {
        return new Promise((resolve) => {
            const start = os.cpus().map(cpu => cpu.times);
            setTimeout(() => {
                const end = os.cpus().map(cpu => cpu.times);
                const idle = end.map((t, i) => t.idle - start[i].idle);
                const total = end.map((t, i) =>
                    Object.values(t).reduce((a, b) => a + b) -
                    Object.values(start[i]).reduce((a, b) => a + b)
                );
                const usage = 100 - (idle.reduce((a, b) => a + b) / total.reduce((a, b) => a + b)) * 100;
                resolve(Math.round(usage));
            }, 100);
        });
    }

    private getMemoryUsage(): number {
        const total = os.totalmem();
        const free = os.freemem();
        return Math.round((total - free) / total * 100);
    }

    private async getDiskUsage(): Promise<number> {
        return new Promise((resolve, reject) => {
            const wmic = spawn('wmic', ['logicaldisk', 'get', 'size,freespace']);
            let output = '';

            wmic.stdout.on('data', (data) => {
                output += data.toString();
            });

            wmic.on('close', () => {
                const lines = output.trim().split('\n').slice(1);
                let totalSize = 0;
                let totalFree = 0;

                lines.forEach(line => {
                    const [free, size] = line.trim().split(/\s+/).map(Number);
                    if (free && size) {
                        totalFree += free;
                        totalSize += size;
                    }
                });

                resolve(Math.round((totalSize - totalFree) / totalSize * 100));
            });

            wmic.on('error', reject);
        });
    }

    private checkThresholds(): void {
        Object.entries(this.ALERT_THRESHOLDS).forEach(async ([metric, threshold]) => {
            if (this.metrics[metric as keyof SystemMetrics] > threshold) {
                await this.handleMetricAlert(metric, this.metrics[metric as keyof SystemMetrics], threshold);
                this.emit('alert', {
                    metric,
                    value: this.metrics[metric as keyof SystemMetrics],
                    threshold
                });
            }
        });
    }

    private async handleMetricAlert(metric: string, value: number, threshold: number): Promise<void> {
        const lastAlert = this.alertHistory.get(metric) || 0;
        const now = Date.now();

        if (now - lastAlert < this.ALERT_COOLDOWN) {
            return;
        }

        const severity = this.determineAlertSeverity(value, threshold);
        const title = `System Alert: ${metric}`;
        const message = `${metric} usage is at ${value}% (threshold: ${threshold}%)`;

        await this.alertService.showAlert({
            title,
            message,
            severity,
            action: () => {
                this.window.show();
                this.window.webContents.send('show-metrics');
            }
        });

        this.alertHistory.set(metric, now);
    }

    private determineAlertSeverity(value: number, threshold: number): AlertSeverity {
        const difference = value - threshold;
        if (difference > 20) return AlertSeverity.CRITICAL;
        if (difference > 10) return AlertSeverity.ERROR;
        if (difference > 5) return AlertSeverity.WARNING;
        return AlertSeverity.INFO;
    }

    public stopMonitoring(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}