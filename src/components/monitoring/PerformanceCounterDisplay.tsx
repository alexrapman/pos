// src/components/monitoring/PerformanceCounterDisplay.tsx
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { WindowsPerformanceFormatters } from '../../utils/windowsFormatters';

interface CounterData {
    id: string;
    values: number[];
    timestamps: string[];
}

export const PerformanceCounterDisplay: React.FC = () => {
    const [selectedCounters, setSelectedCounters] = useState<string[]>([]);
    const [counterData, setCounterData] = useState<Map<string, CounterData>>(new Map());

    useEffect(() => {
        const handleCounterUpdate = (data: Record<string, number>) => {
            const timestamp = new Date().toLocaleTimeString();

            setCounterData(prev => {
                const newData = new Map(prev);

                Object.entries(data).forEach(([id, value]) => {
                    if (!selectedCounters.includes(id)) return;

                    const current = newData.get(id) || {
                        id,
                        values: [],
                        timestamps: []
                    };

                    newData.set(id, {
                        ...current,
                        values: [...current.values.slice(-30), value],
                        timestamps: [...current.timestamps.slice(-30), timestamp]
                    });
                });

                return newData;
            });
        };

        window.electron?.performance.onCounterUpdate(handleCounterUpdate);
        return () => {
            window.electron?.performance.removeListener('counterUpdate', handleCounterUpdate);
        };
    }, [selectedCounters]);

    const chartData = {
        labels: Array.from(counterData.values())[0]?.timestamps || [],
        datasets: Array.from(counterData.values()).map(counter => ({
            label: counter.id,
            data: counter.values,
            borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
            tension: 0.1
        }))
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Performance Counters</h2>
                <select
                    multiple
                    value={selectedCounters}
                    onChange={(e) => setSelectedCounters(
                        Array.from(e.target.selectedOptions, option => option.value)
                    )}
                    className="w-full mt-2 p-2 border rounded"
                >
                    {Array.from(window.electron?.performance.getAvailableCounters() || [])
                        .map(counter => (
                            <option key={counter} value={counter}>
                                {counter}
                            </option>
                        ))}
                </select>
            </div>

            <Line
                data={chartData}
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
    );
};