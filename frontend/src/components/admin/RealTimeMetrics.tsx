// frontend/src/components/admin/RealTimeMetrics.tsx
import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { useSocket } from '../../hooks/useSocket';

interface MetricData {
  timestamp: number;
  value: number;
}

interface SystemMetrics {
  cpu: MetricData[];
  memory: MetricData[];
  requests: MetricData[];
  responseTime: MetricData[];
}

export const RealTimeMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: [],
    memory: [],
    requests: [],
    responseTime: []
  });

  useSocket('metrics', (newMetric: any) => {
    setMetrics(prev => ({
      ...prev,
      [newMetric.type]: [
        ...prev[newMetric.type].slice(-20),
        { timestamp: Date.now(), value: newMetric.value }
      ]
    }));
  });

  const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'second'
        }
      },
      y: {
        beginAtZero: true
      }
    },
    animation: {
      duration: 0
    },
    responsive: true
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">CPU Usage</h3>
        <Line
          data={{
            labels: metrics.cpu.map(m => new Date(m.timestamp)),
            datasets: [{
              label: 'CPU %',
              data: metrics.cpu.map(m => m.value),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          }}
          options={chartOptions}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Memory Usage</h3>
        <Line
          data={{
            labels: metrics.memory.map(m => new Date(m.timestamp)),
            datasets: [{
              label: 'Memory %',
              data: metrics.memory.map(m => m.value),
              borderColor: 'rgb(153, 102, 255)',
              tension: 0.1
            }]
          }}
          options={chartOptions}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Request Rate</h3>
        <Bar
          data={{
            labels: metrics.requests.map(m => new Date(m.timestamp)),
            datasets: [{
              label: 'Requests/sec',
              data: metrics.requests.map(m => m.value),
              backgroundColor: 'rgb(54, 162, 235)'
            }]
          }}
          options={chartOptions}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Response Time</h3>
        <Line
          data={{
            labels: metrics.responseTime.map(m => new Date(m.timestamp)),
            datasets: [{
              label: 'ms',
              data: metrics.responseTime.map(m => m.value),
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1
            }]
          }}
          options={chartOptions}
        />
      </div>
    </div>
  );
};