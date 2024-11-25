// src/components/monitoring/PerformanceMetrics.tsx
import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { formatBytes, formatPercent } from '../../utils/formatters';

interface PerformanceData {
    cpu: number[];
    memory: number[];
    disk: number[];
    network: number[];
    timestamps: string[];
}

export const PerformanceMetrics: React.FC = () => {
    const [data, setData] = useState<PerformanceData>({
        cpu: [],
        memory: [],
        disk: [],
        network: [],
        timestamps: []
    });

    useEffect(() => {
        const updateInterval = setInterval(() => {
            window.electron?.system.getMetrics().then((metrics: any) => {
                setData(prev => ({
                    cpu: [...prev.cpu.slice(-30), metrics.cpu],
                    memory: [...prev.memory.slice(-30), metrics.memory],
                    disk: [...prev.disk.slice(-30), metrics.disk],
                    network: [...prev.network.slice(-30), metrics.network],
                    timestamps: [...prev.timestamps.slice(-30), new Date().toLocaleTimeString()]
                }));
            });
        }, 1000);

        return () => clearInterval(updateInterval);
    }, []);

    const chartOptions = {
        responsive: true,
        animation: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        },
        plugins: {
            legend: {
                position: 'top' as const
            }
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">CPU & Memory Usage</h3>
                <Line
                    data={{
                        labels: data.timestamps,
                        datasets: [
                            {
                                label: 'CPU',
                                data: data.cpu,
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1
                            },
                            {
                                label: 'Memory',
                                data: data.memory,
                                borderColor: 'rgb(255, 99, 132)',
                                tension: 0.1
                            }
                        ]
                    }}
                    options={chartOptions}
                />
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Disk & Network</h3>
                <Bar
                    data={{
                        labels: data.timestamps,
                        datasets: [
                            {
                                label: 'Disk I/O',
                                data: data.disk,
                                backgroundColor: 'rgb(153, 102, 255)'
                            },
                            {
                                label: 'Network',
                                data: data.network,
                                backgroundColor: 'rgb(54, 162, 235)'
                            }
                        ]
                    }}
                    options={chartOptions}
                />
            </div>
        </div>
    );
};