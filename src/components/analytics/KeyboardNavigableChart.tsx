// src/components/analysis/KeyboardNavigableChart.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { DetailedDataModal } from './DetailedDataModal';
import { format } from 'date-fns';

interface KeyboardNavigableChartProps {
    data: PerformanceMetric[];
    metric: 'cpu' | 'memory' | 'networkLatency';
}

export const KeyboardNavigableChart: React.FC<KeyboardNavigableChartProps> = ({
    data,
    metric
}) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [showModal, setShowModal] = useState(false);
    const chartRef = useRef<any>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === -1) return;

            switch (e.key) {
                case 'ArrowLeft':
                    setSelectedIndex(Math.max(0, selectedIndex - 1));
                    break;
                case 'ArrowRight':
                    setSelectedIndex(Math.min(data.length - 1, selectedIndex + 1));
                    break;
                case 'Enter':
                    setShowModal(true);
                    break;
                case 'Escape':
                    setShowModal(false);
                    setSelectedIndex(-1);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, data.length]);

    const handleChartClick = (event: any, elements: any[]) => {
        if (elements.length > 0) {
            setSelectedIndex(elements[0].index);
            setShowModal(true);
        }
    };

    return (
        <div
            className="relative"
            tabIndex={0}
            role="application"
            aria-label="Performance metrics chart"
        >
            <Line
                ref={chartRef}
                data={{
                    labels: data.map(d => format(d.timestamp, 'HH:mm:ss')),
                    datasets: [{
                        label: metric.toUpperCase(),
                        data: data.map(d => d[metric]),
                        borderColor: '#3B82F6',
                        fill: false,
                        pointBackgroundColor: (context: any) =>
                            context.dataIndex === selectedIndex ? '#EF4444' : '#3B82F6',
                        pointRadius: (context: any) =>
                            context.dataIndex === selectedIndex ? 6 : 3
                    }]
                }}
                options={{
                    onClick: handleChartClick,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (context: any) => {
                                    const value = context.parsed.y;
                                    return `${metric}: ${value.toFixed(2)}`;
                                }
                            }
                        }
                    }
                }}
            />
            {showModal && selectedIndex !== -1 && (
                <DetailedDataModal
                    metric={data[selectedIndex]}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedIndex(-1);
                    }}
                />
            )}
            <div className="sr-only" role="status" aria-live="polite">
                {selectedIndex !== -1 && `Selected data point: ${format(data[selectedIndex].timestamp, 'HH:mm:ss')}`}
            </div>
        </div>
    );
};