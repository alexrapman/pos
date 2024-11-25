// pages/index.tsx
import React from 'react';
import { DashboardLayout } from '../components/layouts/DashboardLayout';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Restaurant POS Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardCard
            title="Orders Today"
            value="25"
            icon="📋"
          />
          <DashboardCard
            title="Active Tables"
            value="8"
            icon="🪑"
          />
          <DashboardCard
            title="Total Sales"
            value="$1,250"
            icon="💰"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

const DashboardCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <span className="text-4xl">{icon}</span>
      <div className="text-right">
        <p className="text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);