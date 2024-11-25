// src/components/analysis/PredictionBandsChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';

interface PredictionBandsProps {
    data: PerformanceMetric[];
    metric: 'cpu' | 'memory' | 'networkLatency';
    confidenceLevel?: number;
}

export const PredictionBandsChart: React.FC<PredictionBandsProps> = ({
    data,
    metric,
    confidenceLevel = 0.95
}) => {
    const calculatePredictionBands = () => {
        const values = data.map(d => d[metric]);
        const n = values.length;
        const mean = values.reduce((a, b) => a + b, 0) / n;
        const stdDev = Math.sqrt(
            values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1)
        );

        const zScore = 1.96; // 95% confidence interval
        const margin = zScore * stdDev / Math.sqrt(n);

        return {
            upper: values.map(v => v + margin),
            lower: values.map(v => v - margin)
        };
    };

    const bands = calculatePredictionBands();

    return (
        <Line
            data={{
                labels: data.map(d => format(d.timestamp, 'HH:mm')),
                datasets: [
                    {
                        label: 'Actual',
                        data: data.map(d => d[metric]),
                        borderColor: '#3B82F6',
                        fill: false
                    },
                    {
                        label: 'Upper Band',
                        data: bands.upper,
                        borderColor: 'rgba(59, 130, 246, 0.2)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: '+1'
                    },
                    {
                        label: 'Lower Band',
                        data: bands.lower,
                        borderColor: 'rgba(59, 130, 246, 0.2)',
                        fill: false
                    }
                ]
            }}
            options={{
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.y;
                                return `${context.dataset.label}: ${value.toFixed(2)}`;
                            }
                        }
                    }
                }
            }}
        />
    );
};