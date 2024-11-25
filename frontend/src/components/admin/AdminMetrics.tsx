// frontend/src/components/admin/AdminMetrics.tsx
import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { format, subWeeks } from 'date-fns';
import { saveAs } from 'file-saver';

interface MetricsData {
  dailyMetrics: any[];
  weeklyMetrics: any[];
  popularProducts: any[];
}

const AdminMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [dateRange, setDateRange] = useState<string>('4');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [dateRange]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const [daily, weekly, products] = await Promise.all([
        fetch(`/api/metrics/sales/daily`).then(r => r.json()),
        fetch(`/api/metrics/sales/weekly?weeks=${dateRange}`).then(r => r.json()),
        fetch(`/api/metrics/products/popular`).then(r => r.json())
      ]);

      setMetrics({ dailyMetrics: daily, weeklyMetrics: weekly, popularProducts: products });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const csv = convertToCSV(metrics);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `metrics_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  };

  if (loading) return <div>Loading metrics...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Metrics</h2>
        <div className="flex gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded p-2"
          >
            <option value="4">Last 4 weeks</option>
            <option value="12">Last 12 weeks</option>
            <option value="26">Last 6 months</option>
          </select>
          <button
            onClick={exportData}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Weekly Sales Trend</h3>
          <Line
            data={{
              labels: metrics?.weeklyMetrics.map(m => 
                format(new Date(m.week), 'MMM d')
              ),
              datasets: [{
                label: 'Sales',
                data: metrics?.weeklyMetrics.map(m => m.totalSales),
                fill: false,
                borderColor: 'rgb(75, 192, 192)'
              }]
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Popular Products</h3>
          <Bar
            data={{
              labels: metrics?.popularProducts.map(p => p['Product.name']),
              datasets: [{
                label: 'Units Sold',
                data: metrics?.popularProducts.map(p => p.totalQuantity),
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
              }]
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminMetrics;