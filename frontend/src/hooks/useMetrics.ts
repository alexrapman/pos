// frontend/src/hooks/useMetrics.ts
import { useState, useEffect } from 'react';
import { useMetricsStore } from '../services/MetricsClient';

export const useRealTimeMetrics = (metricType: string) => {
  const metrics = useMetricsStore((state) => state.metrics[metricType]);
  const [aggregatedData, setAggregatedData] = useState({
    current: 0,
    average: 0,
    max: 0,
    min: 0
  });

  useEffect(() => {
    if (metrics.length > 0) {
      setAggregatedData({
        current: metrics[metrics.length - 1],
        average: metrics.reduce((a, b) => a + b, 0) / metrics.length,
        max: Math.max(...metrics),
        min: Math.min(...metrics)
      });
    }
  }, [metrics]);

  return {
    data: metrics,
    ...aggregatedData
  };
};

export const useMetricsFilter = (metricType: string, timeRange: number) => {
  const metrics = useMetricsStore((state) => state.metrics[metricType]);
  const [filteredData, setFilteredData] = useState<number[]>([]);

  useEffect(() => {
    const now = Date.now();
    const filtered = metrics.filter((_, index) => {
      const timestamp = now - (metrics.length - index) * 1000;
      return now - timestamp <= timeRange * 1000;
    });
    setFilteredData(filtered);
  }, [metrics, timeRange]);

  return filteredData;
};

export const useMetricsExport = () => {
  const metrics = useMetricsStore((state) => state.metrics);

  const exportToCsv = () => {
    const headers = ['timestamp', 'cpu', 'memory', 'requests', 'responseTime'];
    const rows = Object.values(metrics)[0].map((_, index) => {
      return [
        new Date(Date.now() - (metrics.cpu.length - index) * 1000).toISOString(),
        metrics.cpu[index],
        metrics.memory[index],
        metrics.requests[index],
        metrics.responseTime[index]
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `metrics-${new Date().toISOString()}.csv`;
    link.click();
  };

  return { exportToCsv };
};