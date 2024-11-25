// src/services/CounterManagementService.ts
import { writeFileSync, readFileSync, existsSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export class CounterManagementService {
    private readonly configPath: string;
    private counterCache: Map<string, string[]> = new Map();

    constructor() {
        this.configPath = path.join(process.env.APPDATA!, 'RestaurantPOS', 'counters.json');
        this.ensureConfigDirectory();
    }

    private ensureConfigDirectory(): void {
        const dir = path.dirname(this.configPath);
        if (!existsSync(dir)) {
            execSync(`mkdir "${dir}"`);
        }
    }

    public async discoverCounters(): Promise<Map<string, string[]>> {
        if (this.counterCache.size > 0) {
            return this.counterCache;
        }

        try {
            const output = execSync('typeperf -q', { encoding: 'utf8' });
            const lines = output.split('\n');

            let currentCategory = '';
            lines.forEach(line => {
                if (line.startsWith('\\')) {
                    const parts = line.split('\\');
                    const category = parts[1].split('(')[0];
                    const counter = parts[2];

                    if (category !== currentCategory) {
                        currentCategory = category;
                        if (!this.counterCache.has(category)) {
                            this.counterCache.set(category, []);
                        }
                    }

                    this.counterCache.get(category)!.push(counter);
                }
            });

            return this.counterCache;
        } catch (error) {
            console.error('Failed to discover counters:', error);
            return new Map();
        }
    }

    public saveSelectedCounters(counters: string[]): void {
        try {
            writeFileSync(this.configPath, JSON.stringify(counters), 'utf8');
        } catch (error) {
            console.error('Failed to save counter selection:', error);
        }
    }

    public loadSelectedCounters(): string[] {
        try {
            if (existsSync(this.configPath)) {
                return JSON.parse(readFileSync(this.configPath, 'utf8'));
            }
        } catch (error) {
            console.error('Failed to load counter selection:', error);
        }
        return [];
    }
}