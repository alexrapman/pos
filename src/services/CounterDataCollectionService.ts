// src/services/CounterDataCollectionService.ts
import { EventEmitter } from 'events';
import { writeFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

interface CounterDataPoint {
    timestamp: number;
    value: number;
    counterId: string;
}

export class CounterDataCollectionService extends EventEmitter {
    private activeCounters: Set<string> = new Set();
    private dataBuffer: Map<string, CounterDataPoint[]> = new Map();
    private collectionInterval: NodeJS.Timeout | null = null;
    private readonly BUFFER_SIZE = 1000;
    private readonly DATA_DIR: string;

    constructor() {
        super();
        this.DATA_DIR = path.join(process.env.APPDATA!, 'RestaurantPOS', 'counter-data');
        this.ensureDataDirectory();
    }

    private ensureDataDirectory(): void {
        execSync(`mkdir "${this.DATA_DIR}" 2>nul`);
    }

    public startCollection(counterIds: string[], interval: number = 1000): void {
        this.activeCounters = new Set(counterIds);

        if (this.collectionInterval) {
            clearInterval(this.collectionInterval);
        }

        this.collectionInterval = setInterval(() => {
            this.collectData();
        }, interval);
    }

    private async collectData(): Promise<void> {
        const timestamp = Date.now();
        const cmd = Array.from(this.activeCounters)
            .map(id => `"${id}"`)
            .join(' ');

        try {
            const output = execSync(`typeperf -sc 1 ${cmd}`, { encoding: 'utf8' });
            const values = this.parseTypePerfOutput(output);

            Array.from(this.activeCounters).forEach((counterId, index) => {
                const value = values[index];
                this.addDataPoint(counterId, timestamp, value);
            });

            this.emit('data-collected', Array.from(this.activeCounters));
        } catch (error) {
            console.error('Failed to collect counter data:', error);
        }
    }

    private parseTypePerfOutput(output: string): number[] {
        const lines = output.split('\n');
        if (lines.length < 3) return [];

        return lines[2]
            .split(',')
            .slice(1)
            .map(value => parseFloat(value.replace(/"/g, '')));
    }

    private addDataPoint(counterId: string, timestamp: number, value: number): void {
        if (!this.dataBuffer.has(counterId)) {
            this.dataBuffer.set(counterId, []);
        }

        const buffer = this.dataBuffer.get(counterId)!;
        buffer.push({ timestamp, value, counterId });

        if (buffer.length > this.BUFFER_SIZE) {
            this.persistData(counterId);
        }
    }

    private persistData(counterId: string): void {
        const buffer = this.dataBuffer.get(counterId)!;
        const filePath = path.join(this.DATA_DIR, `${counterId.replace(/[\\/]/g, '_')}.json`);

        writeFileSync(filePath, JSON.stringify(buffer), 'utf8');
        this.dataBuffer.set(counterId, []);
    }

    public stopCollection(): void {
        if (this.collectionInterval) {
            clearInterval(this.collectionInterval);
            this.collectionInterval = null;
        }

        // Persist remaining data
        for (const counterId of this.activeCounters) {
            this.persistData(counterId);
        }
    }
}