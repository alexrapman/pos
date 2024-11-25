// backend/src/services/MonitoringService.ts
import { EventEmitter } from 'events';

export class MonitoringService extends EventEmitter {
    private interval: NodeJS.Timeout | null = null;

    start(intervalMs: number = 5000) {
        this.interval = setInterval(() => {
            const memoryUsage = process.memoryUsage();
            const cpuUsage = process.cpuUsage();

            this.emit('metrics', {
                memoryUsage,
                cpuUsage
            });
        }, intervalMs);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}