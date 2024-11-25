// src/services/DataExportService.ts
import { writeFileSync } from 'fs';
import { saveAs } from 'file-saver';
import path from 'path';

// src/services/SystemHealthMonitor.ts
import { EventLogReader } from 'windows-eventlog';
import { Notification } from 'electron';

interface DataPoint {
    timestamp: number;
    value: number;
    counterId: string;
}

interface HealthReport {
    timestamp: Date;
    cpuUsage: number;
    memoryUsage: number;
    diskSpace: number;
    criticalEvents: any[];
}

export class DataExportService {
    public exportToCSV(data: DataPoint[], counterId: string): void {
        const csv = data.map(point =>
            `${new Date(point.timestamp).toISOString()},${point.value}`
        ).join('\n');

        const blob = new Blob([`Timestamp,Value\n${csv}`], { type: 'text/csv' });
        saveAs(blob, `counter-data-${counterId.replace(/[\\/]/g, '_')}.csv`);
    }

    public exportToJSON(data: DataPoint[], counterId: string): void {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        saveAs(blob, `counter-data-${counterId.replace(/[\\/]/g, '_')}.json`);
    }

    public saveToFile(data: DataPoint[], counterId: string, format: 'csv' | 'json'): void {
        const filePath = path.join(process.env.APPDATA!, 'RestaurantPOS', `counter-data-${counterId.replace(/[\\/]/g, '_')}.${format}`);
        const content = format === 'csv' ? this.convertToCSV(data) : JSON.stringify(data, null, 2);
        writeFileSync(filePath, content, 'utf8');
    }

    private convertToCSV(data: DataPoint[]): string {
        return data.map(point =>
            `${new Date(point.timestamp).toISOString()},${point.value}`
        ).join('\n');
    }
}

export class SystemHealthMonitor {
    private readonly REPORT_DIR: string;
    private eventLog: EventLogReader;

    constructor() {
        this.REPORT_DIR = path.join(process.env.APPDATA!, 'RestaurantPOS', 'health-reports');
        this.eventLog = new EventLogReader('System');
        this.initialize();
    }

    private async initialize(): Promise<void> {
        await this.createDirectories();
        this.startEventLogMonitoring();
    }

    private async createDirectories(): Promise<void> {
        const dirs = [this.REPORT_DIR];
        for (const dir of dirs) {
            if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true });
            }
        }
    }

    public async generateHealthReport(): Promise<HealthReport> {
        const cpuUsage = await this.getCPUUsage();
        const memoryUsage = await this.getMemoryUsage();
        const diskSpace = await this.getDiskSpace();
        const criticalEvents = await this.getCriticalEvents();

        const report: HealthReport = {
            timestamp: new Date(),
            cpuUsage,
            memoryUsage,
            diskSpace,
            criticalEvents
        };

        this.saveReport(report);
        this.checkThresholds(report);

        return report;
    }

    private async saveReport(report: HealthReport): Promise<void> {
        const fileName = `health-report-${format(report.timestamp, 'yyyyMMdd-HHmmss')}.json`;
        const filePath = path.join(this.REPORT_DIR, fileName);
        writeFileSync(filePath, JSON.stringify(report, null, 2));
    }

    private checkThresholds(report: HealthReport): void {
        if (report.cpuUsage > 80 || report.memoryUsage > 90 || report.diskSpace < 10) {
            new Notification({
                title: 'System Health Alert',
                body: 'System resources are reaching critical levels',
                icon: path.join(__dirname, '../assets/warning.png')
            }).show();
        }
    }
}