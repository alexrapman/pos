// mobile/components/SystemMetrics.js
import React, { useEffect, useState } from 'react';

export default function SystemMetrics() {
    const [metrics, setMetrics] = useState({ memoryUsage: {}, cpuUsage: {} });

    useEffect(() => {
        const fetchMetrics = async () => {
            const response = await fetch('/api/metrics', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setMetrics(data);
        };

        const interval = setInterval(fetchMetrics, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Métricas del Sistema</h1>
            <div>
                <h2 className="text-xl font-bold">Uso de Memoria</h2>
                <p>Total: {metrics.memoryUsage.total}</p>
                <p>Usado: {metrics.memoryUsage.used}</p>
                <p>Libre: {metrics.memoryUsage.free}</p>
            </div>
            <div>
                <h2 className="text-xl font-bold">Uso de CPU</h2>
                <p>Usuario: {metrics.cpuUsage.user}</p>
                <p>Sistema: {metrics.cpuUsage.system}</p>
            </div>
        </div>
    );
}