// src/services/CounterMetadataService.ts
import { Registry } from 'winreg';
import { execSync } from 'child_process';

interface CounterMetadata {
    name: string;
    type: string;
    defaultScale: number;
    description: string;
    path: string;
}

export class CounterMetadataService {
    private metadataCache: Map<string, CounterMetadata> = new Map();
    private registry: Registry;

    constructor() {
        this.registry = new Registry({
            hive: Registry.HKLM,
            key: '\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Perflib\\009'
        });
    }

    public async getCounterMetadata(counterId: string): Promise<CounterMetadata> {
        if (this.metadataCache.has(counterId)) {
            return this.metadataCache.get(counterId)!;
        }

        const metadata = await this.loadCounterMetadata(counterId);
        this.metadataCache.set(counterId, metadata);
        return metadata;
    }

    private async loadCounterMetadata(counterId: string): Promise<CounterMetadata> {
        try {
            const cmd = `powershell "Get-Counter -Counter '${counterId}' -ListSet | Select-Object -Property *"`;
            const output = execSync(cmd, { encoding: 'utf8' });

            const description = await this.getCounterDescription(counterId);

            return {
                name: counterId.split('\\').pop() || '',
                type: this.determineCounterType(output),
                defaultScale: this.extractDefaultScale(output),
                description,
                path: counterId
            };
        } catch (error) {
            console.error(`Failed to load metadata for counter ${counterId}:`, error);
            throw error;
        }
    }

    private determineCounterType(output: string): string {
        if (output.includes('TYPE_COUNTER_RATE')) return 'Rate';
        if (output.includes('TYPE_COUNTER_RAWCOUNT')) return 'Raw Count';
        if (output.includes('TYPE_PERF_AVERAGE_BULK')) return 'Average';
        return 'Unknown';
    }

    private extractDefaultScale(output: string): number {
        const match = output.match(/DefaultScale\s*:\s*(\d+)/);
        return match ? parseInt(match[1], 10) : 1;
    }

    private async getCounterDescription(counterId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.registry.get('Help', (err, item) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(item?.value || 'No description available');
            });
        });
    }
}