// src/components/metrics/MetricsPanel.tsx
import React, { useState, useEffect } from 'react';
import { MetricFormatters } from '../../utils/metricFormatters';
import { ResourceMonitor } from '../../services/ResourceMonitor';
import { Line } from 'react-chartjs-2';

interface MetricCardProps {
    title: string;
    value: number;
    type: 'bytes' | 'percent' | 'duration';
    trend?: 'up' | 'down' | 'stable';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, type, trend }) => {
    const formattedValue = type === 'bytes'
        ? MetricFormatters.formatBytes(value)
        : type === 'percent'
            ? MetricFormatters.formatPercent(value)
            : MetricFormatters.formatDuration(value);

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
                <h3 className="text-gray-500 text-sm">{title}</h3>
                {trend && (
                    <span className={`
                        ${trend === 'up' ? 'text-red-500' : ''}
                        ${trend === 'down' ? 'text-green-500' : ''}
                        ${trend === 'stable' ? 'text-blue-500' : ''}
                    `}>
                        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
                    </span>
                )}
            </div>
            <div className="text-2xl font-bold mt-2">{formattedValue}</div>
        </div>
    );
};

export const MetricsPanel: React.FC = () => {
    const [metrics, setMetrics] = useState<any>({});
    const monitor = new ResourceMonitor();

    useEffect(() => {
        monitor.startMonitoring();

        monitor.on('metrics', (newMetrics) => {
            setMetrics(prev => ({
                ...prev,
                ...newMetrics,
                timestamp: MetricFormatters.formatWindowsTime(Date.now())
            }));
        });

        return () => monitor.stop();
    }, []);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <MetricCard
                    title="Memoria Usada"
                    value={metrics.memoryUsage || 0}
                    type="bytes"
                    trend={metrics.memoryTrend}
                />
                <MetricCard
                    title="CPU"
                    value={metrics.cpuUsage || 0}
                    type="percent"
                    trend={metrics.cpuTrend}
                />
                <MetricCard
                    title="Tiempo Activo"
                    value={metrics.uptime || 0}
                    type="duration"
                />
            </div>
        </div>
    );
};