// src/components/reports/ReportExporter.tsx
import React, { useState } from 'react';
import { MetricsExportService } from '../../services/MetricsExportService';
import { format } from 'date-fns';

interface ReportExporterProps {
    metrics: any[];
    reportName?: string;
}

export const ReportExporter: React.FC<ReportExporterProps> = ({
    metrics,
    reportName = 'Metricas'
}) => {
    const [exporting, setExporting] = useState(false);
    const [exportFormat, setExportFormat] = useState<'excel' | 'csv'>('excel');
    const exportService = new MetricsExportService();

    const handleExport = async () => {
        try {
            setExporting(true);
            const filePath = exportFormat === 'excel'
                ? await exportService.exportToExcel(metrics, reportName)
                : await exportService.exportToCsv(metrics, reportName);

            // Abrir la carpeta de destino en Windows
            window.require('child_process').exec(`explorer.exe /select,"${filePath}"`);
        } catch (error) {
            console.error('Error al exportar:', error);
            alert('Error al exportar el reporte');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-4">
                <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as 'excel' | 'csv')}
                    className="border rounded px-3 py-2"
                    disabled={exporting}
                >
                    <option value="excel">Excel (.xlsx)</option>
                    <option value="csv">CSV</option>
                </select>

                <button
                    onClick={handleExport}
                    disabled={exporting}
                    className={`
                        px-4 py-2 rounded text-white
                        ${exporting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'}
                    `}
                >
                    {exporting ? 'Exportando...' : 'Exportar Reporte'}
                </button>
            </div>
        </div>
    );
};