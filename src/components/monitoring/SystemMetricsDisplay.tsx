// src/components/monitoring/SystemMetricsDisplay.tsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { SystemMetrics } from '../../services/WindowsSystemMonitor';

interface MetricsHistory {
    timestamps: string[];
    cpu: number[];
    memory: number[];
    disk: number[];
    temperature: number[];
}

export const SystemMetricsDisplay: React.FC = () => {
    const [currentMetrics, setCurrentMetrics] = useState<SystemMetrics | null>(null);
    const [history, setHistory] = useState<MetricsHistory>({
        timestamps: [],
        cpu: [],
        memory: [],
        disk: [],
        temperature: []
    });

    useEffect(() => {
        window.electron?.system.onMetrics((metrics: SystemMetrics) => {
            setCurrentMetrics(metrics);

            const timestamp = new Date().toLocaleTimeString();
            setHistory(prev => ({
                timestamps: [...prev.timestamps, timestamp].slice(-30),
                cpu: [...prev.cpu, metrics.cpu].slice(-30),
                memory: [...prev.memory, metrics.memory].slice(-30),
                disk: [...prev.disk, metrics.disk].slice(-30),
                temperature: [...prev.temperature, metrics.temperature].slice(-30)
            }));
        });
    }, []);

    const chartData = {
        labels: history.timestamps,
        datasets: [
            {
                label: 'CPU Usage',
                data: history.cpu,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: 'Memory Usage',
                data: history.memory,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }
        ]
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">System Performance</h2>

            <div className="grid grid-cols-4 gap-4 mb-6">
                <MetricCard
                    title="CPU Usage"
                    value={currentMetrics?.cpu || 0}
                    unit="%"
                    alert={currentMetrics?.cpu > 80}
                />
                <MetricCard
                    title="Memory Usage"
                    value={currentMetrics?.memory || 0}
                    unit="%"
                    alert={currentMetrics?.memory > 85}
                />
                <MetricCard
                    title="Disk Usage"
                    value={currentMetrics?.disk || 0}
                    unit="%"
                    alert={currentMetrics?.disk > 90}
                />
                <MetricCard
                    title="Temperature"
                    value={currentMetrics?.temperature || 0}
                    unit="°C"
                    alert={currentMetrics?.temperature > 75}
                />
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <Line data={chartData} options={{
                    responsive: true,
                    animation: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }} />
            </div>
        </div>
    );
};