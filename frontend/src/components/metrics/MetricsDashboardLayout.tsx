// frontend/src/components/metrics/MetricsDashboardLayout.tsx
import React from 'react';
import { MetricsChart } from './charts/MetricsChart';
import { useMetrics } from '../../context/MetricsContext';

export const MetricsDashboardLayout: React.FC = () => {
  const { timeRange, setTimeRange, autoRefresh, setAutoRefresh } = useMetrics();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">System Metrics</h2>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="border rounded p-2"
          >
            {['1h', '1d', '1w'].map(option => (
              <option key={option} value={option}>
                {option === '1h' ? 'Last Hour' : option === '1d' ? 'Last 24 Hours' : 'Last Week'}
              </option>
            ))}
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="form-checkbox"
            />
            <span>Auto Refresh</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricsChart
          type="line"
          title="Response Time"
          metricKey="responseTime"
          color="#2196f3"
          timeRange={timeRange}
        />
        
        <MetricsChart
          type="bar"
          title="Requests per Minute"
          metricKey="requestCount"
          color="#4caf50"
          timeRange={timeRange}
        />
        
        <MetricsChart
          type="line"
          title="Memory Usage"
          metricKey="memoryUsage"
          color="#ff9800"
          timeRange={timeRange}
        />
        
        <MetricsChart
          type="line"
          title="CPU Usage"
          metricKey="cpuUsage"
          color="#f44336"
          timeRange={timeRange}
        />
        
        <MetricsChart
          type="line"
          title="Active Connections"
          metricKey="activeConnections"
          color="#9c27b0"
          timeRange={timeRange}
        />
      </div>
    </div>
  );
};