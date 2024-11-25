// src/components/monitoring/SystemMetricsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Line, Gauge } from 'react-chartjs-2';
import { WindowsMetricsService } from '../../services/WindowsMetricsService';

export const SystemMetricsDashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<SystemMetrics[]>([]);
    const [currentMetrics, setCurrentMetrics] = useState<SystemMetrics | null>(null);
    const metricsService = new WindowsMetricsService();

    useEffect(() => {
        const updateInterval = setInterval(async () => {
            const newMetrics = await metricsService.collectMetrics();
            setCurrentMetrics(newMetrics);
            setMetrics(prev => [...prev.slice(-30), newMetrics]);
        }, 1000);

        return () => clearInterval(updateInterval);
    }, []);

    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2">System Load</h3>
                <Gauge
                    data={{
                        datasets: [{
                            value: currentMetrics?.cpuUsage || 0,
                            minValue: 0,
                            maxValue: 100,
                            backgroundColor: ['#10B981', '#F59E0B', '#EF4444']
                        }]
                    }}
                    options={{
                        responsive: true,
                        valueLabel: { display: true, formatter: (value: number) => `${value}%` }
                    }}
                />
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2">Memory Usage</h3>
                <Line
                    data={{
                        labels: metrics.map((_, i) => i),
                        datasets: [{
                            label: 'Memory Usage %',
                            data: metrics.map(m => m.memoryUsage),
                            borderColor: '#3B82F6'
                        }]
                    }}
                    options={{
                        responsive: true,
                        scales: { y: { beginAtZero: true, max: 100 } }
                    }}
                />
            </div>
        </div>
    );
};