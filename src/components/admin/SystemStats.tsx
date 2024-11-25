// src/components/admin/SystemStats.tsx
import React from 'react';
import { Card } from '../ui/Card';

interface SystemStatsProps {
    stats: {
        activeSessions: number;
        activeOrders: number;
        systemLoad: number;
        uptime: string;
    };
}

export const SystemStats: React.FC<SystemStatsProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <Card>
                <h3 className="text-lg font-semibold">Active Sessions</h3>
                <p className="text-3xl">{stats.activeSessions}</p>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold">Active Orders</h3>
                <p className="text-3xl">{stats.activeOrders}</p>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold">System Load</h3>
                <p className="text-3xl">{stats.systemLoad}%</p>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold">Uptime</h3>
                <p className="text-3xl">{stats.uptime}</p>
            </Card>
        </div>
    );
};