// frontend/src/components/admin/AdvancedMetrics.tsx
import React, { useState, useEffect } from 'react';
import { Line, Bar, Radar } from 'react-chartjs-2';
import { DateRangePicker } from 'react-date-range';
import { format } from 'date-fns';

interface AdvancedMetricsProps {
  onExport: (data: any) => void;
}

export const AdvancedMetrics: React.FC<AdvancedMetricsProps> = ({ onExport }) => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
    key: 'selection'
  });
  const [metrics, setMetrics] = useState<any>(null);
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    fetchAdvancedMetrics();
  }, [dateRange, view]);

  const fetchAdvancedMetrics = async () => {
    try {
      const response = await fetch(`/api/metrics/advanced?` + new URLSearchParams({
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
        view
      }));
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching advanced metrics:', error);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advanced Analytics</h2>
        <div className="flex gap-4">
          <select 
            value={view}
            onChange={(e) => setView(e.target.value as any)}
            className="border rounded p-2"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button
            onClick={() => onExport(metrics)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Revenue</h3>
          <p className="text-3xl font-bold">${metrics?.totalRevenue || 0}</p>
          <p className="text-sm text-gray-500">
            {format(dateRange.startDate, 'MMM d')} - {format(dateRange.endDate, 'MMM d')}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Orders</h3>
          <p className="text-3xl font-bold">{metrics?.totalOrders || 0}</p>
          <p className="text-sm text-green-500">
            +{metrics?.orderGrowth || 0}% vs previous period
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Avg. Order Value</h3>
          <p className="text-3xl font-bold">${metrics?.averageOrderValue || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Revenue Trend</h3>
          <Line
            data={{
              labels: metrics?.revenueTrend?.map((d: any) => d.date),
              datasets: [{
                label: 'Revenue',
                data: metrics?.revenueTrend?.map((d: any) => d.revenue),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }]
            }}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Category Performance</h3>
          <Radar
            data={{
              labels: metrics?.categoryPerformance?.map((c: any) => c.category),
              datasets: [{
                label: 'Orders',
                data: metrics?.categoryPerformance?.map((c: any) => c.orders),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgb(54, 162, 235)',
              }]
            }}
          />
        </div>
      </div>
    </div>
  );
};