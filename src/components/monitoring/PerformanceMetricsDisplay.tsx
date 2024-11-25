// src/components/monitoring/PerformanceMetricsDisplay.tsx
import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { PerformanceMetricsCollector } from '../../services/PerformanceMetricsCollector';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

export const PerformanceMetricsDisplay: React.FC = () => {
    const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
    const [collector] = useState(() => new PerformanceMetricsCollector());
    const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('1h');

    useEffect(() => {
        collector.startCollection();
        collector.on('metrics', (metric) => {
            setMetrics(prev => [...prev.slice(-100), metric]);
        });

        return () => collector.removeAllListeners();
    }, []);

    const exportData = () => {
        const csv = metrics.map(m =>
            `${format(m.timestamp, 'yyyy-MM-dd HH:mm:ss')},${m.cpu},${m.memory},${m.diskIO},${m.networkLatency},${m.notificationLatency}`
        ).join('\n');

        const blob = new Blob([
            'Timestamp,CPU,Memory,DiskIO,NetworkLatency,NotificationLatency\n' + csv
        ], { type: 'text/csv' });

        saveAs(blob, `performance-metrics-${format(new Date(), 'yyyyMMdd-HHmmss')}.csv`);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">System Performance</h2>
                <div className="space-x-2">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as any)}
                        className="border rounded px-3 py-2"
                    >
                        <option value="1h">Last Hour</option>
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                    </select>
                    <button
                        onClick={exportData}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">System Resources</h3>
                    <Line
                        data={{
                            labels: metrics.map(m => format(m.timestamp, 'HH:mm:ss')),
                            datasets: [
                                {
                                    label: 'CPU Usage %',
                                    data: metrics.map(m => m.cpu),
                                    borderColor: '#3B82F6'
                                },
                                {
                                    label: 'Memory Usage %',
                                    data: metrics.map(m => m.memory),
                                    borderColor: '#10B981'
                                }
                            ]
                        }}
                        options={{
                            responsive: true,
                            scales: { y: { beginAtZero: true, max: 100 } }
                        }}
                    />
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Latency</h3>
                    <Bar
                        data={{
                            labels: metrics.map(m => format(m.timestamp, 'HH:mm:ss')),
                            datasets: [
                                {
                                    label: 'Network Latency (ms)',
                                    data: metrics.map(m => m.networkLatency),
                                    backgroundColor: '#6366F1'
                                },
                                {
                                    label: 'Notification Latency (ms)',
                                    data: metrics.map(m => m.notificationLatency),
                                    backgroundColor: '#F59E0B'
                                }
                            ]
                        }}
                        options={{
                            responsive: true
                        }}
                    />
                </div>
            </div>
        </div>
    );
};