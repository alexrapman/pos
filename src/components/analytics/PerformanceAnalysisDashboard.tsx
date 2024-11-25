// src/components/analysis/PerformanceAnalysisDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Line, Scatter } from 'react-chartjs-2';
import { HistoricalDataAnalyzer } from '../../services/HistoricalDataAnalyzer';
import { format } from 'date-fns';

export const PerformanceAnalysisDashboard: React.FC<{
    metrics: PerformanceMetric[];
}> = ({ metrics }) => {
    const [timeRange, setTimeRange] = useState<string>('24h');
    const [analysis, setAnalysis] = useState<any>(null);
    const analyzer = new HistoricalDataAnalyzer();

    useEffect(() => {
        const results = analyzer.analyzeMetrics(metrics, timeRange);
        setAnalysis(results);
    }, [metrics, timeRange]);

    if (!analysis) return <div>Loading analysis...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Performance Analysis</h2>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="1h">Last Hour</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Resource Trends</h3>
                    <Line
                        data={{
                            labels: metrics.map(m => format(m.timestamp, 'HH:mm')),
                            datasets: [
                                {
                                    label: 'CPU Trend',
                                    data: metrics.map(m => m.cpu),
                                    borderColor: '#3B82F6',
                                    trendline: analysis.trends.cpu
                                }
                            ]
                        }}
                    />
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Anomaly Detection</h3>
                    <Scatter
                        data={{
                            datasets: [
                                {
                                    label: 'CPU Anomalies',
                                    data: analysis.anomalies.cpu.map((value: number, index: number) => ({
                                        x: index,
                                        y: value
                                    })),
                                    backgroundColor: '#EF4444'
                                }
                            ]
                        }}
                    />
                </div>
            </div>
        </div>
    );
};