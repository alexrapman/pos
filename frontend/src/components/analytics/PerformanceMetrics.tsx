// frontend/src/components/analytics/PerformanceMetrics.tsx
import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { AnalyticsService } from '../../services/AnalyticsService';
import { MetricCard } from './MetricCard';

export const PerformanceMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const analyticsService = new AnalyticsService();

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    const data = await analyticsService.getPerformanceMetrics();
    setMetrics(data);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Avg Preparation Time"
          value={metrics?.averagePreparationTime || 0}
          suffix="min"
        />
        <MetricCard
          title="Table Turnover Rate"
          value={metrics?.tableTurnoverRate || 0}
          suffix="per day"
        />
        <MetricCard
          title="Kitchen Efficiency"
          value={metrics?.kitchenEfficiency || 0}
          suffix="%"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Peak Hours Analysis</h3>
          <Bar
            data={{
              labels: metrics?.peakHours?.map(h => `${h.hour}:00`),
              datasets: [{
                label: 'Orders',
                data: metrics?.peakHours?.map(h => h.orderCount),
                backgroundColor: '#3f51b5'
              }]
            }}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Number of Orders'
                  }
                }
              }
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Kitchen Performance</h3>
          <Line
            data={{
              labels: metrics?.kitchenPerformance?.map(k => k.time),
              datasets: [{
                label: 'Prep Time',
                data: metrics?.kitchenPerformance?.map(k => k.prepTime),
                borderColor: '#f44336'
              }]
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Table Utilization</h3>
          <Doughnut
            data={{
              labels: ['In Use', 'Available', 'Reserved'],
              datasets: [{
                data: [
                  metrics?.tableUtilization?.inUse || 0,
                  metrics?.tableUtilization?.available || 0,
                  metrics?.tableUtilization?.reserved || 0
                ],
                backgroundColor: ['#4caf50', '#2196f3', '#ff9800']
              }]
            }}
          />
        </div>
      </div>
    </div>
  );
};