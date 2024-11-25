// src/components/monitoring/CounterPreview.tsx
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { WindowsPerformanceFormatters } from '../../utils/windowsFormatters';

interface CounterPreviewProps {
    counterId: string;
    onClose: () => void;
}

export const CounterPreview: React.FC<CounterPreviewProps> = ({ counterId, onClose }) => {
    const [metadata, setMetadata] = useState<any>(null);
    const [values, setValues] = useState<number[]>([]);
    const [timestamps, setTimestamps] = useState<string[]>([]);

    useEffect(() => {
        const loadMetadata = async () => {
            const data = await window.electron?.performance.getCounterMetadata(counterId);
            setMetadata(data);
        };
        loadMetadata();

        const updateInterval = setInterval(async () => {
            const value = await window.electron?.performance.getCounterValue(counterId);
            const timestamp = new Date().toLocaleTimeString();

            setValues(prev => [...prev.slice(-20), value]);
            setTimestamps(prev => [...prev.slice(-20), timestamp]);
        }, 1000);

        return () => clearInterval(updateInterval);
    }, [counterId]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-2/3 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{counterId}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>

                {metadata && (
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold">Type</h3>
                            <p>{metadata.type}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Default Scale</h3>
                            <p>{metadata.defaultScale}</p>
                        </div>
                    </div>
                )}

                <div className="h-64">
                    <Line
                        data={{
                            labels: timestamps,
                            datasets: [{
                                label: 'Value',
                                data: values,
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1
                            }]
                        }}
                        options={{
                            responsive: true,
                            animation: false,
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};