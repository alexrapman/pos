// src/components/admin/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { LineChart } from '../charts/LineChart';
import { SystemStats } from './SystemStats';
import { UserManagement } from './UserManagement';

interface DashboardProps {
    apiUrl: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ apiUrl }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [stats, setStats] = useState<any>({});

    useEffect(() => {
        const socketInstance = io(apiUrl);
        setSocket(socketInstance);

        socketInstance.on('stats:update', (newStats) => {
            setStats(newStats);
        });

        socketInstance.emit('subscribe:monitoring');

        return () => {
            socketInstance.disconnect();
        };
    }, [apiUrl]);

    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            <div className="col-span-2">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            </div>

            <SystemStats stats={stats} />

            <div className="bg-white p-4 rounded shadow">
                <LineChart
                    data={stats.sessionHistory || []}
                    title="Active Sessions"
                />
            </div>

            <div className="col-span-2">
                <UserManagement />
            </div>
        </div>
    );
};