// src/components/reports/EnhancedReportExporter.tsx
import React, { useState } from 'react';
import { MetricsExportService } from '../../services/MetricsExportService';
import { WindowsNotificationService } from '../../services/WindowsNotificationService';
import { ProgressBar } from '../ui/ProgressBar';

interface EnhancedReportExporterProps {
    metrics: any[];
    reportName?: string;
}

export const EnhancedReportExporter: React.FC<EnhancedReportExporterProps> = ({
    metrics,
    reportName = 'Metricas'
}) => {
    const [exporting, setExporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [exportFormat, setExportFormat] = useState<'excel' | 'csv'>('excel');

    const exportService = new MetricsExportService();
    const notificationService = new WindowsNotificationService();

    const handleExport = async () => {
        try {
            setExporting(true);
            setProgress(0);

            // Simular progreso
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    const newProgress = Math.min(prev + 10, 90);
                    notificationService.showExportProgress(newProgress);
                    return newProgress;
                });
            }, 500);

            const filePath = exportFormat === 'excel'
                ? await exportService.exportToExcel(metrics, reportName)
                : await exportService.exportToCsv(metrics, reportName);

            clearInterval(progressInterval);
            setProgress(100);
            notificationService.showExportSuccess(filePath);

        } catch (error) {
            notificationService.showExportError(error.message);
        } finally {
            setExporting(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
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

            {progress > 0 && (
                <ProgressBar
                    progress={progress}
                    className="h-2"
                />
            )}
        </div>
    );
};