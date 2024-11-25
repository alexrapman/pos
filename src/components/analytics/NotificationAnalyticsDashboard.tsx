// src/components/analytics/NotificationAnalyticsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { NotificationTrackingService } from '../../services/NotificationTrackingService';

export const NotificationAnalyticsDashboard: React.FC = () => {
    const [analytics, setAnalytics] = useState<any>(null);
    const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
    const trackingService = new NotificationTrackingService();

    useEffect(() => {
        const report = trackingService.generateReport();
        setAnalytics(report);
    }, [timeRange]);

    const exportData = () => {
        const data = JSON.stringify(analytics, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        saveAs(blob, `notification-analytics-${format(new Date(), 'yyyy-MM-dd')}.json`);
    };

    if (!analytics) return <div>Loading...</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold">Notification Analytics</h2>
                <div className="space-x-2">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as any)}
                        className="border rounded px-3 py-2"
                    >
                        <option value="day">Last 24 Hours</option>
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                    </select>
                    <button
                        onClick={exportData}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Export Data
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
                    <Pie
                        data={{
                            labels: ['Success', 'Failure'],
                            datasets: [{
                                data: [
                                    analytics.successRate * 100,
                                    (1 - analytics.successRate) * 100
                                ],
                                backgroundColor: ['#10B981', '#EF4444']
                            }]
                        }}
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Response Times</h3>
                    <Line
                        data={{
                            labels: Array(24).fill(0).map((_, i) => `${i}:00`),
                            datasets: [{
                                label: 'Average Response Time (ms)',
                                data: analytics.averageResponseTime,
                                borderColor: '#3B82F6'
                            }]
                        }}
                    />
                </div>
            </div>
        </div>
    );
};