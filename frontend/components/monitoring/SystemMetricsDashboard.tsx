// src/components/monitoring/SystemMetricsDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { SystemMetrics } from '../../src/services/SystemMonitorService';

interface MetricsHistory {
    timestamps: string[];
    cpu: number[];
    memory: number[];
    disk: number[];
}

export const SystemMetricsDashboard: React.FC = () => {
    const [currentMetrics, setCurrentMetrics] = useState<SystemMetrics | null>(null);
    const [history, setHistory] = useState<MetricsHistory>({
        timestamps: [],
        cpu: [],
        memory: [],
        disk: []
    });

    useEffect(() => {
        const systemMonitor = window.electron.getSystemMonitor();

        systemMonitor.on('metrics', (metrics: SystemMetrics) => {
            setCurrentMetrics(metrics);

            const timestamp = new Date().toLocaleTimeString();
            setHistory(prev => ({
                timestamps: [...prev.timestamps.slice(-30), timestamp],
                cpu: [...prev.cpu.slice(-30), metrics.cpu],
                memory: [...prev.memory.slice(-30), (metrics.memory.used / metrics.memory.total) * 100],
                disk: [...prev.disk.slice(-30), (metrics.disk.used / metrics.disk.total) * 100]
            }));
        });

        systemMonitor.startMonitoring(1000);
        return () => systemMonitor.stop();
    }, []);

    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            <div className="col-span-2 bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-bold mb-4">Rendimiento del Sistema</h2>
                <Line
                    data={{
                        labels: history.timestamps,
                        datasets: [
                            {
                                label: 'CPU %',
                                data: history.cpu,
                                borderColor: '#3B82F6',
                                tension: 0.1
                            },
                            {
                                label: 'Memoria %',
                                data: history.memory,
                                borderColor: '#10B981',
                                tension: 0.1
                            },
                            {
                                label: 'Disco %',
                                data: history.disk,
                                borderColor: '#F59E0B',
                                tension: 0.1
                            }
                        ]
                    }}
                    options={{
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100
                            }
                        }
                    }}
                />
            </div>

            <MetricCard
                title="CPU"
                value={currentMetrics?.cpu ?? 0}
                type="percentage"
                color="blue"
            />
            <MetricCard
                title="Memoria"
                value={(currentMetrics?.memory.used ?? 0) / (currentMetrics?.memory.total ?? 1) * 100}
                type="percentage"
                color="green"
            />
        </div>
    );
};