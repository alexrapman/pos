// frontend/src/components/metrics/MetricsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { useSocket } from '../../hooks/useSocket';

interface MetricsData {
  responseTime: number[];
  requestCount: number[];
  memoryUsage: number[];
  timestamps: string[];
}

export const MetricsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsData>({
    responseTime: [],
    requestCount: [],
    memoryUsage: [],
    timestamps: []
  });

  // Real-time updates
  useSocket('metrics', (data) => {
    setMetrics(prev => ({
      responseTime: [...prev.responseTime.slice(-20), data.responseTime],
      requestCount: [...prev.requestCount.slice(-20), data.requestCount],
      memoryUsage: [...prev.memoryUsage.slice(-20), data.memoryUsage],
      timestamps: [...prev.timestamps.slice(-20), new Date().toLocaleTimeString()]
    }));
  });

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Response Time</h3>
        <Line
          data={{
            labels: metrics.timestamps,
            datasets: [{
              label: 'Response Time (ms)',
              data: metrics.responseTime,
              borderColor: '#2196f3',
              tension: 0.1
            }]
          }}
          options={{ responsive: true }}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Request Count</h3>
        <Bar
          data={{
            labels: metrics.timestamps,
            datasets: [{
              label: 'Requests per minute',
              data: metrics.requestCount,
              backgroundColor: '#4caf50'
            }]
          }}
          options={{ responsive: true }}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Memory Usage</h3>
        <Line
          data={{
            labels: metrics.timestamps,
            datasets: [{
              label: 'Memory (MB)',
              data: metrics.memoryUsage.map(bytes => bytes / 1024 / 1024),
              borderColor: '#ff9800',
              tension: 0.1
            }]
          }}
          options={{ responsive: true }}
        />
      </div>
    </div>
  );
};