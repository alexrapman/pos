// frontend/src/components/metrics/charts/MetricsChart.tsx
import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
import { useMetricsSocket } from '../../../hooks/useMetricsSocket';

interface MetricsChartProps {
  type: 'line' | 'bar';
  title: string;
  metricKey: string;
  color: string;
  timeRange: '1h' | '1d' | '1w';
}

export const MetricsChart: React.FC<MetricsChartProps> = ({
  type,
  title,
  metricKey,
  color,
  timeRange
}) => {
  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useMetricsSocket((metric) => {
    setData(prev => [...prev.slice(-30), metric[metricKey]]);
    setLabels(prev => [
      ...prev.slice(-30),
      format(new Date(), 'HH:mm:ss')
    ]);
  });

  const chartData = {
    labels,
    datasets: [{
      label: title,
      data,
      borderColor: color,
      backgroundColor: `${color}33`,
      tension: 0.3
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            return `${title}: ${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => {
            if (metricKey === 'memoryUsage') {
              return `${(value / 1024 / 1024).toFixed(2)} MB`;
            }
            return value;
          }
        }
      }
    }
  };

  const ChartComponent = type === 'line' ? Line : Bar;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <ChartComponent data={chartData} options={options} />
    </div>
  );
};