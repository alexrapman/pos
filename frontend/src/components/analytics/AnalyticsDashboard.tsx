// frontend/src/components/analytics/AnalyticsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { AnalyticsService } from '../../services/AnalyticsService';
import { MetricCard } from './MetricCard';
import { format } from 'date-fns';

export const AnalyticsDashboard: React.FC = () => {
  const [salesMetrics, setSalesMetrics] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [salesHistory, setSalesHistory] = useState<any[]>([]);
  const analyticsService = new AnalyticsService();

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const [daily, performance, history] = await Promise.all([
      analyticsService.getDailySalesMetrics(),
      analyticsService.getPerformanceMetrics(),
      analyticsService.getSalesComparison(7)
    ]);

    setSalesMetrics(daily);
    setPerformanceMetrics(performance);
    setSalesHistory(history);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Daily Sales"
          value={`$${salesMetrics?.totalSales.toFixed(2)}`}
          change={+10.5}
        />
        <MetricCard
          title="Orders"
          value={salesMetrics?.orderCount}
          change={+5.2}
        />
        <MetricCard
          title="Avg Order Value"
          value={`$${salesMetrics?.averageOrderValue.toFixed(2)}`}
          change={-2.1}
        />
        <MetricCard
          title="Table Utilization"
          value={`${performanceMetrics?.tableUtilization}%`}
          change={+8.3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Sales Trend</h3>
          <Line
            data={{
              labels: salesHistory.map(d => format(new Date(d.date), 'MMM d')),
              datasets: [{
                label: 'Sales',
                data: salesHistory.map(d => d.totalSales),
                borderColor: '#2196f3',
                tension: 0.1
              }]
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Top Products</h3>
          <Bar
            data={{
              labels: salesMetrics?.topProducts.map(p => p.name),
              datasets: [{
                label: 'Revenue',
                data: salesMetrics?.topProducts.map(p => p.revenue),
                backgroundColor: '#4caf50'
              }]
            }}
          />
        </div>
      </div>
    </div>
  );
};