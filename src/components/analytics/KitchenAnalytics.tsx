// src/components/analytics/KitchenAnalytics.tsx
import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Order } from '../../models/Order';
import { saveAs } from 'file-saver';

interface AnalyticsData {
    orderCompletionTimes: number[];
    ordersByHour: number[];
    itemPopularity: Record<string, number>;
}

export const KitchenAnalytics: React.FC = () => {
    const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
        orderCompletionTimes: [],
        ordersByHour: new Array(24).fill(0),
        itemPopularity: {}
    });

    useEffect(() => {
        fetchAnalyticsData(timeRange);
    }, [timeRange]);

    const exportData = () => {
        const csv = convertToCSV(analyticsData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `kitchen-analytics-${timeRange}.csv`);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">Kitchen Performance Analytics</h2>
                <div className="space-x-4">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as any)}
                        className="border p-2 rounded"
                    >
                        <option value="day">Last 24 Hours</option>
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                    </select>
                    <button
                        onClick={exportData}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Export Data
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Order Completion Times</h3>
                    <Line data={getCompletionTimeChartData()} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Orders by Hour</h3>
                    <Bar data={getOrdersByHourChartData()} />
                </div>
            </div>
        </div>
    );
};