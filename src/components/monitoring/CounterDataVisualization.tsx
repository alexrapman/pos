// src/components/monitoring/CounterDataVisualization.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'react-chartjs-2';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { FiDownload, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { DataExportService } from '../../services/DataExportService';

interface DataPoint {
    timestamp: number;
    value: number;
    counterId: string;
}

interface CounterDataVisualizationProps {
    counterId: string;
    refreshInterval?: number;
}

export const CounterDataVisualization: React.FC<CounterDataVisualizationProps> = ({
    counterId,
    refreshInterval = 1000
}) => {
    const [data, setData] = useState<DataPoint[]>([]);
    const [zoomLevel, setZoomLevel] = useState(1);
    const chartRef = useRef<Chart | null>(null);
    const exportService = new DataExportService();

    useEffect(() => {
        const updateInterval = setInterval(async () => {
            const newData = await window.electron?.performance.getCounterData(counterId);
            setData(prev => [...prev, ...newData]);
        }, refreshInterval);

        return () => clearInterval(updateInterval);
    }, [counterId, refreshInterval]);

    const handleExport = (format: 'csv' | 'json') => {
        if (format === 'csv') {
            exportService.exportToCSV(data, counterId);
        } else {
            exportService.exportToJSON(data, counterId);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between mb-4">
                <h3 className="text-lg font-bold">{counterId}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setZoomLevel(prev => prev * 1.2)}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        <FiZoomIn />
                    </button>
                    <button
                        onClick={() => setZoomLevel(prev => prev / 1.2)}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        <FiZoomOut />
                    </button>
                    <button
                        onClick={() => handleExport('csv')}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        <FiDownload /> CSV
                    </button>
                    <button
                        onClick={() => handleExport('json')}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        <FiDownload /> JSON
                    </button>
                </div>
            </div>

            <Chart
                ref={chartRef}
                type="line"
                data={{
                    labels: data.map(d => format(d.timestamp, 'HH:mm:ss')),
                    datasets: [{
                        label: 'Value',
                        data: data.map(d => d.value),
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                }}
                options={{
                    responsive: true,
                    animation: false,
                    scales: {
                        x: {
                            min: Math.max(0, data.length - (100 / zoomLevel)),
                            max: data.length
                        }
                    },
                    plugins: {
                        zoom: {
                            pan: {
                                enabled: true,
                                mode: 'x'
                            },
                            zoom: {
                                wheel: { enabled: true },
                                pinch: { enabled: true },
                                mode: 'x'
                            }
                        }
                    }
                }}
            />
        </div>
    );
};