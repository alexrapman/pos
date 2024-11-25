// src/components/analysis/DetailedDataModal.tsx
import React from 'react';
import { format } from 'date-fns';
import { FiX, FiDownload } from 'react-icons/fi';
import { saveAs } from 'file-saver';

interface DetailedDataModalProps {
    metric: PerformanceMetric;
    onClose: () => void;
}

export const DetailedDataModal: React.FC<DetailedDataModalProps> = ({
    metric,
    onClose
}) => {
    const exportData = () => {
        const csv = `Timestamp,CPU,Memory,DiskIO,NetworkLatency,NotificationLatency\n${format(metric.timestamp, 'yyyy-MM-dd HH:mm:ss')},${metric.cpu},${metric.memory},${metric.diskIO},${metric.networkLatency},${metric.notificationLatency}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        saveAs(blob, `detailed-metric-${format(metric.timestamp, 'yyyyMMdd-HHmmss')}.csv`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Detailed Metric</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX />
                    </button>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Timestamp:</span>
                        <span className="font-medium">{format(metric.timestamp, 'yyyy-MM-dd HH:mm:ss')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>CPU Usage:</span>
                        <span className="font-medium">{metric.cpu.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Memory Usage:</span>
                        <span className="font-medium">{metric.memory.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Disk I/O:</span>
                        <span className="font-medium">{metric.diskIO.toFixed(2)} MB/s</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Network Latency:</span>
                        <span className="font-medium">{metric.networkLatency} ms</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Notification Latency:</span>
                        <span className="font-medium">{metric.notificationLatency} ms</span>
                    </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={exportData}
                        className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2"
                    >
                        <FiDownload />
                        Export CSV
                    </button>
                </div>
            </div>
        </div>
    );
};