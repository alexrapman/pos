// src/components/analysis/PerformanceMetricsChart.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { InteractiveTooltip } from './InteractiveTooltip';
import { DetailedDataModal } from './DetailedDataModal';
import { format } from 'date-fns';

interface PerformanceMetricsChartProps {
    data: PerformanceMetric[];
    metric: 'cpu' | 'memory' | 'networkLatency';
}

export const PerformanceMetricsChart: React.FC<PerformanceMetricsChartProps> = ({
    data,
    metric
}) => {
    const chartRef = useRef<any>(null);
    const [tooltip, setTooltip] = useState<{ metric: PerformanceMetric; position: { x: number; y: number }; visible: boolean }>({
        metric: data[0],
        position: { x: 0, y: 0 },
        visible: false
    });
    const [selectedMetric, setSelectedMetric] = useState<PerformanceMetric | null>(null);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedMetric(null);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    const handleHover = (event: any, elements: any[]) => {
        if (!elements.length) {
            setTooltip(prev => ({ ...prev, visible: false }));
            return;
        }

        const { index } = elements[0];
        const metricData = data[index];
        const position = {
            x: event.x,
            y: event.y
        };

        setTooltip({ metric: metricData, position, visible: true });
    };

    const handleClick = (event: any, elements: any[]) => {
        if (!elements.length) return;

        const { index } = elements[0];
        const metricData = data[index];
        const position = {
            x: event.x,
            y: event.y
        };

        setTooltip({ metric: metricData, position, visible: true });
        setSelectedMetric(data[index]);
    };

    return (
        <div className="relative">
            <Line
                ref={chartRef}
                data={{
                    labels: data.map(d => format(d.timestamp, 'HH:mm:ss')),
                    datasets: [{
                        label: metric.toUpperCase(),
                        data: data.map(d => d[metric]),
                        borderColor: '#3B82F6',
                        fill: false
                    }]
                }}
                options={{
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            suggestedMax: metric === 'networkLatency' ? undefined : 100
                        }
                    },
                    plugins: {
                        tooltip: {
                            enabled: false
                        }
                    },
                    onHover: handleHover,
                    onClick: handleClick
                }}
            />
            <InteractiveTooltip
                metric={tooltip.metric}
                position={tooltip.position}
                visible={tooltip.visible}
            />
            {selectedMetric && (
                <DetailedDataModal
                    metric={selectedMetric}
                    onClose={() => setSelectedMetric(null)}
                />
            )}
        </div>
    );
};