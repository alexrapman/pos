// src/components/monitoring/NotificationPerformanceMetrics.tsx
import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { format } from 'date-fns';

interface PerformanceMetrics {
    timestamp: number;
    deliveryTime: number;
    displayTime: number;
    systemLoad: number;
}

export const NotificationPerformanceMetrics: React.FC = () => {
    const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        if (!isRecording) return;

        const trace = new WindowsEventTrace('Microsoft-Windows-UserNotifications');

        const collector = trace.startCollection((event) => {
            setMetrics(prev => [...prev, {
                timestamp: Date.now(),
                deliveryTime: event.deliveryTime,
                displayTime: event.displayTime,
                systemLoad: event.systemLoad
            }]);
        });

        return () => collector.stop();
    }, [isRecording]);

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">Notification Performance</h3>
                <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`px-4 py-2 rounded ${isRecording
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white'
                        }`}
                >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h4 className="text-sm font-medium mb-2">Delivery Time</h4>
                    <Line
                        data={{
                            labels: metrics.map(m => format(m.timestamp, 'HH:mm:ss')),
                            datasets: [{
                                label: 'ms',
                                data: metrics.map(m => m.deliveryTime),
                                borderColor: '#3B82F6'
                            }]
                        }}
                        options={{
                            responsive: true,
                            scales: { y: { beginAtZero: true } }
                        }}
                    />
                </div>

                <div>
                    <h4 className="text-sm font-medium mb-2">System Impact</h4>
                    <Bar
                        data={{
                            labels: metrics.map(m => format(m.timestamp, 'HH:mm:ss')),
                            datasets: [{
                                label: 'System Load %',
                                data: metrics.map(m => m.systemLoad),
                                backgroundColor: '#10B981'
                            }]
                        }}
                        options={{
                            responsive: true,
                            scales: { y: { beginAtZero: true, max: 100 } }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};