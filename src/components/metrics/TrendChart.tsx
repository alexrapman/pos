// src/components/metrics/TrendChart.tsx
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { MetricFormatters } from '../../utils/metricFormatters';

interface TrendData {
    timestamps: string[];
    values: number[];
    prediction?: number[];
}

export const TrendChart: React.FC<{
    data: TrendData;
    title: string;
    type: 'bytes' | 'percent';
}> = ({ data, title, type }) => {
    const [hoveredValue, setHoveredValue] = useState<number | null>(null);

    const formatValue = (value: number) => {
        return type === 'bytes'
            ? MetricFormatters.formatBytes(value)
            : MetricFormatters.formatPercent(value);
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                {hoveredValue !== null && (
                    <span className="text-sm text-gray-600">
                        {formatValue(hoveredValue)}
                    </span>
                )}
            </div>

            <Line
                data={{
                    labels: data.timestamps,
                    datasets: [
                        {
                            label: 'Actual',
                            data: data.values,
                            borderColor: '#3B82F6',
                            fill: false
                        },
                        data.prediction && {
                            label: 'Predicción',
                            data: data.prediction,
                            borderColor: '#9CA3AF',
                            borderDash: [5, 5],
                            fill: false
                        }
                    ].filter(Boolean)
                }}
                options={{
                    onHover: (_, elements) => {
                        if (elements && elements.length > 0) {
                            const value = data.values[elements[0].index];
                            setHoveredValue(value);
                        } else {
                            setHoveredValue(null);
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (context) => formatValue(context.parsed.y)
                            }
                        }
                    }
                }}
            />
        </div>
    );
};