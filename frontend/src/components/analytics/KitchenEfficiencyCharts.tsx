// frontend/src/components/analytics/KitchenEfficiencyCharts.tsx
import React from 'react';
import { Line, Bar, Gauge } from 'react-chartjs-2';
import { KitchenEfficiencyService } from '../../services/KitchenEfficiencyService';

export const KitchenEfficiencyCharts: React.FC<{
  metrics: OrderMetrics[];
}> = ({ metrics }) => {
  const efficiencyService = new KitchenEfficiencyService();
  const efficiency = efficiencyService.calculateEfficiency(metrics);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Performance Score</h3>
        <Gauge
          data={{
            datasets: [{
              value: efficiency.performanceScore,
              minValue: 0,
              maxValue: 100,
              backgroundColor: [
                '#f44336',
                '#ff9800',
                '#4caf50'
              ]
            }]
          }}
          options={{
            needle: {
              radiusPercentage: 2,
              widthPercentage: 3.2
            }
          }}
        />
        <div className="text-center mt-4">
          <span className="text-2xl font-bold">
            {efficiency.performanceScore.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Preparation Time Analysis</h3>
        <Line
          data={{
            labels: metrics.map(m => format(new Date(m.startTime), 'HH:mm')),
            datasets: [
              {
                label: 'Actual Time',
                data: metrics.map(m => m.completionTime ? 
                  differenceInMinutes(new Date(m.completionTime), new Date(m.startTime)) : null
                ),
                borderColor: '#2196f3'
              },
              {
                label: 'Target Time',
                data: metrics.map(m => efficiencyService.TARGET_TIMES[m.complexity]),
                borderColor: '#4caf50',
                borderDash: [5, 5]
              }
            ]
          }}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Workload Distribution</h3>
        <Bar
          data={{
            labels: ['Low', 'Medium', 'High'],
            datasets: [{
              label: 'Orders by Complexity',
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
  );
};