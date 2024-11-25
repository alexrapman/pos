// frontend/src/components/admin/AdvancedMetricsViewer.tsx
import React, { useState } from 'react';
import { Line, Bar, Radar } from 'react-chartjs-2';
import { useRealTimeMetrics, useMetricsFilter, useMetricsExport } from '../../hooks/useMetrics';

export const AdvancedMetricsViewer: React.FC = () => {
  const [timeRange, setTimeRange] = useState(300); // 5 minutes
  const [viewType, setViewType] = useState<'line' | 'bar' | 'radar'>('line');
  
  const cpuMetrics = useRealTimeMetrics('cpu');
  const memoryMetrics = useRealTimeMetrics('memory');
  const filteredCpu = useMetricsFilter('cpu', timeRange);
  const { exportToCsv } = useMetricsExport();

  const chartData = {
    labels: Array.from({ length: filteredCpu.length }, (_, i) => 
      new Date(Date.now() - (filteredCpu.length - i) * 1000).toLocaleTimeString()
    ),
    datasets: [
      {
        label: 'CPU Usage',
        data: filteredCpu,
        borderColor: 'rgb(75, 192, 192)',
        fill: false
      },
      {
        label: 'Memory Usage',
        data: useMetricsFilter('memory', timeRange),
        borderColor: 'rgb(153, 102, 255)',
        fill: false
      }
    ]
  };

  const ChartComponent = {
    line: Line,
    bar: Bar,
    radar: Radar
  }[viewType];

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-4">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="border rounded p-2"
          >
            <option value={60}>Last minute</option>
            <option value={300}>Last 5 minutes</option>
            <option value={900}>Last 15 minutes</option>
            <option value={3600}>Last hour</option>
          </select>
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value as any)}
            className="border rounded p-2"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="radar">Radar Chart</option>
          </select>
        </div>
        <button 
          onClick={exportToCsv}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Export Data
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-medium">Real-time Metrics</h3>
            <div className="space-x-2">
              <span className="text-sm">CPU: {cpuMetrics.current.toFixed(2)}%</span>
              <span className="text-sm">Memory: {memoryMetrics.current.toFixed(2)}%</span>
            </div>
          </div>
          <ChartComponent data={chartData} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">CPU</h4>
              <p>Average: {cpuMetrics.average.toFixed(2)}%</p>
              <p>Max: {cpuMetrics.max.toFixed(2)}%</p>
              <p>Min: {cpuMetrics.min.toFixed(2)}%</p>
            </div>
            <div>
              <h4 className="font-medium">Memory</h4>
              <p>Average: {memoryMetrics.average.toFixed(2)}%</p>
              <p>Max: {memoryMetrics.max.toFixed(2)}%</p>
              <p>Min: {memoryMetrics.min.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};