// src/components/analysis/TrendAnalysisChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface TrendAnalysisProps {
    data: PerformanceMetric[];
    metric: 'cpu' | 'memory' | 'networkLatency';
    trendline: { slope: number; direction: string };
}

export const TrendAnalysisChart: React.FC<TrendAnalysisProps> = ({
    data,
    metric,
    trendline
}) => {
    const calculateRegressionLine = () => {
        const values = data.map(d => d[metric]);
        const n = values.length;
        const points = Array.from({ length: n }, (_, i) => ({
            x: i,
            y: trendline.slope * i + (values[0] || 0)
        }));
        return points;
    };

    const regressionLine = calculateRegressionLine();
    const metrics = {
        cpu: { label: 'CPU Usage', color: '#3B82F6' },
        memory: { label: 'Memory Usage', color: '#10B981' },
        networkLatency: { label: 'Network Latency', color: '#6366F1' }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{metrics[metric].label} Trend</h3>
                <div className="flex items-center gap-2">
                    {trendline.direction === 'increasing' ? (
                        <FiTrendingUp className="text-red-500" />
                    ) : (
                        <FiTrendingDown className="text-green-500" />
                    )}
                    <span className="text-sm">
                        {Math.abs(trendline.slope * 100).toFixed(2)}% per hour
                    </span>
                </div>
            </div>

            <Line
                data={{
                    labels: data.map(d => format(d.timestamp, 'HH:mm')),
                    datasets: [
                        {
                            label: metrics[metric].label,
                            data: data.map(d => d[metric]),
                            borderColor: metrics[metric].color,
                            fill: false
                        },
                        {
                            label: 'Trend',
                            data: regressionLine,
                            borderColor: '#9CA3AF',
                            borderDash: [5, 5],
                            fill: false
                        }
                    ]
                }}
                options={{
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            suggestedMax: metric === 'networkLatency' ? undefined : 100
                        }
                    }
                }}
            />
        </div>
    );
};