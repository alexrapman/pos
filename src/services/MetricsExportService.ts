// src/services/MetricsExportService.ts
import { promises as fs } from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { format } from 'date-fns';

export class MetricsExportService {
    private readonly exportDir: string;

    constructor() {
        this.exportDir = path.join(process.env.USERPROFILE!, 'Documents', 'MetricasRestaurantPOS');
        this.ensureExportDir();
    }

    private async ensureExportDir() {
        try {
            await fs.mkdir(this.exportDir, { recursive: true });
        } catch (error) {
            console.error('Error al crear directorio de exportación:', error);
        }
    }

    async exportToExcel(metrics: any[], reportName: string) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Métricas');

        // Configurar encabezados
        worksheet.columns = [
            { header: 'Fecha', key: 'date', width: 20 },
            { header: 'CPU (%)', key: 'cpu', width: 15 },
            { header: 'Memoria (%)', key: 'memory', width: 15 },
            { header: 'Disco (%)', key: 'disk', width: 15 }
        ];

        // Añadir datos
        worksheet.addRows(metrics);

        const fileName = `${reportName}_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
        const filePath = path.join(this.exportDir, fileName);

        await workbook.xlsx.writeFile(filePath);
        return filePath;
    }

    async exportToCsv(metrics: any[], reportName: string) {
        const headers = 'Fecha,CPU (%),Memoria (%),Disco (%)\n';
        const rows = metrics.map(m =>
            `${m.date},${m.cpu},${m.memory},${m.disk}`
        ).join('\n');

        const fileName = `${reportName}_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
        const filePath = path.join(this.exportDir, fileName);

        await fs.writeFile(filePath, headers + rows);
        return filePath;
    }
}