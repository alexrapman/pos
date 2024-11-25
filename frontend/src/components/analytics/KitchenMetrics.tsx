// frontend/src/components/analytics/KitchenMetrics.tsx
import React, { useState, useEffect } from 'react';
import { Line, HeatMap } from 'react-chartjs-2';
import { format } from 'date-fns';
import { MetricCard } from './MetricCard';

interface KitchenMetric {
  orderId: number;
  startTime: string;
  completionTime: string;
  preparationTime: number;
  itemCount: number;
  complexity: 'low' | 'medium' | 'high';
}

export const KitchenMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<KitchenMetric[]>([]);
  const [averagePreparationTime, setAveragePreparationTime] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [busyPeriods, setBusyPeriods] = useState<any>([]);

  useEffect(() => {
    fetchKitchenMetrics();
    const interval = setInterval(fetchKitchenMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchKitchenMetrics = async () => {
    try {
      const response = await fetch('/api/analytics/kitchen-performance');
      const data = await response.json();
      
      setMetrics(data.metrics);
      calculatePerformanceMetrics(data.metrics);
    } catch (error) {
      console.error('Failed to fetch kitchen metrics:', error);
    }
  };

  const calculatePerformanceMetrics = (metrics: KitchenMetric[]) => {
    // Calculate average preparation time
    const avgPrepTime = metrics.reduce((sum, m) => 
      sum + m.preparationTime, 0) / metrics.length;
    setAveragePreparationTime(avgPrepTime);

    // Calculate kitchen efficiency
    const targetPrepTime = 15; // 15 minutes target
    const efficiency = metrics.reduce((sum, m) => 
      sum + (m.preparationTime <= targetPrepTime ? 1 : 0), 0) / metrics.length * 100;
    setEfficiency(efficiency);

    // Calculate busy periods
    const hourlyOrders = metrics.reduce((acc, m) => {
      const hour = new Date(m.startTime).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});
    setBusyPeriods(hourlyOrders);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Average Preparation Time"
          value={averagePreparationTime.toFixed(1)}
          suffix="minutes"
        />
        <MetricCard
          title="Kitchen Efficiency"
          value={efficiency.toFixed(1)}
          suffix="%"
        />
        <MetricCard
          title="Orders in Queue"
          value={metrics.filter(m => !m.completionTime).length}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Preparation Time Trend</h3>
          <Line
            data={{
              labels: metrics.map(m => format(new Date(m.startTime), 'HH:mm')),
              datasets: [{
                label: 'Preparation Time (minutes)',
                data: metrics.map(m => m.preparationTime),
                borderColor: '#2196f3',
                tension: 0.1
              }]
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Minutes'
                  }
                }
              }
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Order Complexity Distribution</h3>
          <div className="h-64">
            <Doughnut
              data={{
                labels: ['Low', 'Medium', 'High'],
                datasets: [{
                  data: [
                    metrics.filter(m => m.complexity === 'low').length,
                    metrics.filter(m => m.complexity === 'medium').length,
                    metrics.filter(m => m.complexity === 'high').length
                  ],
                  backgroundColor: ['#4caf50', '#ff9800', '#f44336']
                }]
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};