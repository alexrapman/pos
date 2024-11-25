// src/services/DataExportService.ts
import { writeFileSync } from 'fs';
import { saveAs } from 'file-saver';
import path from 'path';

interface DataPoint {
    timestamp: number;
    value: number;
    counterId: string;
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