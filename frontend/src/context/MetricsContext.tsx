// frontend/src/context/MetricsContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMetricsSocket } from '../hooks/useMetricsSocket';

interface MetricsContextProps {
  metrics: Record<string, number[]>;
  labels: string[];
  timeRange: '1h' | '1d' | '1w';
  setTimeRange: (range: '1h' | '1d' | '1w') => void;
  autoRefresh: boolean;
  setAutoRefresh: (refresh: boolean) => void;
}

const MetricsContext = createContext<MetricsContextProps | undefined>(undefined);

export const MetricsProvider: React.FC = ({ children }) => {
  const [metrics, setMetrics] = useState<Record<string, number[]>>({});
  const [labels, setLabels] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<'1h' | '1d' | '1w'>('1h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useMetricsSocket((metric) => {
    setMetrics(prev => ({
      ...prev,
      [metric.key]: [...(prev[metric.key] || []).slice(-30), metric.value]
    }));
    setLabels(prev => [
      ...prev.slice(-30),
      new Date().toLocaleTimeString()
    ]);
  });

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      // Fetch historical data based on timeRange
      // Update metrics and labels
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [timeRange, autoRefresh]);

  return (
    <MetricsContext.Provider value={{
      metrics,
      labels,
      timeRange,
      setTimeRange,
      autoRefresh,
      setAutoRefresh
    }}>
      {children}
    </MetricsContext.Provider>
  );
};

export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetrics must be used within a MetricsProvider');
  }
  return context;
};