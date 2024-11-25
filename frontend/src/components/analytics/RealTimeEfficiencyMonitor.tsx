// frontend/src/components/analytics/RealTimeEfficiencyMonitor.tsx
import React, { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { KitchenEfficiencyService } from '../../services/KitchenEfficiencyService';
import { Line } from 'react-chartjs-2';
import { format, subMinutes } from 'date-fns';

export const RealTimeEfficiencyMonitor: React.FC = () => {
  const [realtimeMetrics, setRealtimeMetrics] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const efficiencyService = new KitchenEfficiencyService();

  useSocket('kitchen-metrics', (data) => {
    updateMetrics(data);
  });

  const updateMetrics = (newMetric: any) => {
    setRealtimeMetrics(prev => {
      const newMetrics = [...prev, newMetric].slice(-30); // Keep last 30 readings
      checkAlerts(newMetrics);
      return newMetrics;
    });
  };

  const checkAlerts = (metrics: any[]) => {
    const efficiency = efficiencyService.calculateEfficiency(metrics);
    
    if (efficiency.performanceScore < 70) {
      setAlerts(prev => [
        `Low performance score: ${efficiency.performanceScore.toFixed(1)}%`,
        ...prev.slice(0, 4)
      ]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Real-time Performance</h3>
        <Line
          data={{
            labels: realtimeMetrics.map(m => 
              format(new Date(m.timestamp), 'HH:mm:ss')
            ),
            datasets: [{
              label: 'Efficiency Score',
              data: realtimeMetrics.map(m => m.efficiency),
              borderColor: '#2196f3',
              tension: 0.1
            }]
          }}
          options={{
            scales: {
              y: {
                min: 0,
                max: 100,
                title: {
                  display: true,
                  text: 'Efficiency %'
                }
              }
            },
            animation: {
              duration: 0
            }
          }}
        />
      </div>

      {alerts.length > 0 && (
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="text-red-800 font-medium mb-2">Alerts</h4>
          <ul className="space-y-2">
            {alerts.map((alert, index) => (
              <li key={index} className="text-red-600">{alert}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};