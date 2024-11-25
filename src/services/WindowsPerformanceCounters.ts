// src/services/WindowsPerformanceCounters.ts
import { execSync } from 'child_process';
import { EventEmitter } from 'events';

interface PerformanceCounter {
    category: string;
    name: string;
    instance?: string;
}

export class WindowsPerformanceCounters extends EventEmitter {
    private counters: Map<string, PerformanceCounter> = new Map();
    private intervalId: NodeJS.Timeout | null = null;

    constructor() {
        super();
        this.initializeCounters();
    }

    private initializeCounters(): void {
        const defaultCounters = [
            { category: 'Processor', name: '% Processor Time', instance: '_Total' },
            { category: 'Memory', name: 'Available MBytes' },
            { category: 'PhysicalDisk', name: 'Avg. Disk Queue Length', instance: '_Total' },
            { category: 'Network Interface', name: 'Bytes Total/sec', instance: '*' }
        ];

        defaultCounters.forEach(counter => {
            const id = this.getCounterId(counter);
            this.counters.set(id, counter);
        });
    }

    private getCounterId(counter: PerformanceCounter): string {
        return `\\${counter.category}${counter.instance ? `(${counter.instance})` : ''}\\${counter.name}`;
    }

    public startCollecting(interval: number = 1000): void {
        if (this.intervalId) return;

        this.intervalId = setInterval(() => {
            try {
                const values = this.collectCounterValues();
                this.emit('counters', values);
            } catch (error) {
                console.error('Failed to collect counter values:', error);
            }
        }, interval);
    }

    private collectCounterValues(): Record<string, number> {
        const values: Record<string, number> = {};

        for (const [id, counter] of this.counters) {
            try {
                const cmd = `typeperf -sc 1 "${id}"`;
                const output = execSync(cmd, { encoding: 'utf8' });
                const lines = output.split('\n');
                if (lines.length >= 3) {
                    const value = parseFloat(lines[2].split(',')[1].replace(/"/g, ''));
                    values[id] = value;
                }
            } catch (error) {
                console.error(`Failed to collect counter ${id}:`, error);
            }
        }

        return values;
    }

    public stopCollecting(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}