// frontend/src/components/admin/AlertDashboard.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSocket } from '../../hooks/useSocket';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  acknowledged: boolean;
}

export const AlertDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useSocket('alerts', (alert: Alert) => {
    setAlerts(prev => [alert, ...prev]);
    toast.error(`New Alert: ${alert.title}`);
  });

  const handleAcknowledge = async (alertId: string) => {
    try {
      await fetch(`/api/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, acknowledged: true }
            : alert
        )
      );
    } catch (error) {
      toast.error('Failed to acknowledge alert');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">System Alerts</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Alerts</option>
          <option value="high">High Priority</option>
          <option value="unacknowledged">Unacknowledged</option>
        </select>
      </div>

      <div className="grid gap-4">
        {alerts
          .filter(alert => 
            filter === 'all' || 
            (filter === 'high' && alert.severity === 'high') ||
            (filter === 'unacknowledged' && !alert.acknowledged)
          )
          .map(alert => (
            <div 
              key={alert.id}
              className={`p-4 rounded-lg border ${
                alert.severity === 'high' 
                  ? 'border-red-500 bg-red-50'
                  : 'border-yellow-500 bg-yellow-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{alert.title}</h3>
                  <p className="text-sm">{alert.message}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>
                {!alert.acknowledged && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};