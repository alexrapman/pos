// src/components/monitoring/MetricsDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ResourceMonitor } from '../../services/ResourceMonitor';
import { formatBytes, formatPercent } from '../../utils/formatters';

interface MetricsHistory {
    timestamps: string[];
    memory: number[];
    cpu: number[];
    disk: number[];
}

export const MetricsDashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<MetricsHistory>({
        timestamps: [],
        memory: [],
        cpu: [],
        disk: []
    });
    const [alerts, setAlerts] = useState<any[]>([]);
    const monitor = new ResourceMonitor();

    useEffect(() => {
        monitor.startMonitoring();

        monitor.on('metrics', (newMetrics) => {
            const now = new Date().toLocaleTimeString();

            setMetrics(prev => ({
                timestamps: [...prev.timestamps.slice(-20), now],
                memory: [...prev.memory.slice(-20), newMetrics.memoryUsage],
                cpu: [...prev.cpu.slice(-20), newMetrics.cpuUsage],
                disk: [...prev.disk.slice(-20), newMetrics.diskSpace]
            }));
        });

        monitor.on('alert', (alert) => {
            setAlerts(prev => [...prev, { ...alert, timestamp: new Date() }]);
        });

        return () => monitor.stop();
    }, []);

    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            <div className="col-span-2 bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-bold mb-4">Rendimiento del Sistema</h2>
                <Line
                    data={{
                        labels: metrics.timestamps,
                        datasets: [
                            {
                                label: 'CPU',
                                data: metrics.cpu,
                                borderColor: '#3B82F6'
                            },
                            {
                                label: 'Memoria',
                                data: metrics.memory,
                                borderColor: '#10B981'
                            },
                            {
                                label: 'Disco',
                                data: metrics.disk,
                                borderColor: '#F59E0B'
                            }
                        ]
                    }}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 1
                            }
                        }
                    }}
                />
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-bold mb-2">Alertas</h3>
                <div className="space-y-2">
                    {alerts.slice(-5).map((alert, index) => (
                        <div
                            key={index}
                            className={`p-2 rounded ${alert.level === 'critical' ? 'bg-red-100' : 'bg-yellow-100'
                                }`}
                        >
                            <span className="font-medium">{alert.metric}:</span>
                            {formatPercent(alert.value)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};