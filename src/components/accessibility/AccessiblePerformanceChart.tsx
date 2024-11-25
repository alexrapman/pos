// src/components/accessibility/AccessiblePerformanceChart.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../hooks/useTheme';
import { format } from 'date-fns';

interface AccessiblePerformanceChartProps {
    data: PerformanceMetric[];
    metric: 'cpu' | 'memory' | 'networkLatency';
}

export const AccessiblePerformanceChart: React.FC<AccessiblePerformanceChartProps> = ({
    data,
    metric
}) => {
    const [selectedPoint, setSelectedPoint] = useState<number>(-1);
    const [announceMessage, setAnnounceMessage] = useState('');
    const chartRef = useRef<any>(null);
    const { highContrast } = useTheme();

    const announceMetric = (index: number) => {
        const point = data[index];
        const message = `${metric} at ${format(point.timestamp, 'HH:mm:ss')}: ${point[metric].toFixed(1)}%`;
        setAnnounceMessage(message);
    };

    const getColors = () => {
        return highContrast ? {
            borderColor: '#FFFFFF',
            backgroundColor: '#000000',
            gridColor: '#666666'
        } : {
            borderColor: '#3B82F6',
            backgroundColor: '#93C5FD',
            gridColor: '#E5E7EB'
        };
    };

    const colors = getColors();

    return (
        <div
            role="region"
            aria-label={`${metric} performance chart`}
            className="relative"
        >
            <div
                role="status"
                aria-live="polite"
                className="sr-only"
            >
                {announceMessage}
            </div>

            <Line
                ref={chartRef}
                data={{
                    labels: data.map(d => format(d.timestamp, 'HH:mm:ss')),
                    datasets: [{
                        label: metric,
                        data: data.map(d => d[metric]),
                        borderColor: colors.borderColor,
                        backgroundColor: colors.backgroundColor,
                        fill: true
                    }]
                }}
                options={{
                    plugins: {
                        legend: {
                            labels: {
                                color: colors.borderColor
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: colors.gridColor
                            },
                            ticks: {
                                color: colors.borderColor
                            }
                        },
                        y: {
                            grid: {
                                color: colors.gridColor
                            },
                            ticks: {
                                color: colors.borderColor
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    onHover: (_, elements) => {
                        if (elements && elements.length > 0) {
                            const index = elements[0].index;
                            if (index !== selectedPoint) {
                                setSelectedPoint(index);
                                announceMetric(index);
                            }
                        }
                    }
                }}
            />
        </div>
    );
};