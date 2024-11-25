// src/components/alerts/AlertDisplay.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Alert } from '../../services/AlertService';

interface AlertDisplayProps {
    onAcknowledge: (id: string) => void;
}

export const AlertDisplay: React.FC<AlertDisplayProps> = ({ onAcknowledge }) => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all');
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const alertService = window.electron.getAlertService();

        alertService.on('new-alert', (alert: Alert) => {
            setAlerts(prev => [alert, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Mostrar toast notification
            toast[alert.type](alert.message, {
                position: "bottom-right",
                autoClose: alert.severity > 3 ? false : 5000,
            });
        });

        return () => alertService.removeAllListeners();
    }, []);

    const filteredAlerts = alerts.filter(alert =>
        filter === 'all' || alert.type === filter
    );

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Alertas del Sistema</h2>
                {unreadCount > 0 && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                        {unreadCount} nuevas
                    </span>
                )}
            </div>

            <div className="flex gap-2 mb-4">
                {['all', 'error', 'warning', 'info'].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilter(type as any)}
                        className={`px-3 py-1 rounded ${filter === type
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100'
                            }`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            <AnimatePresence>
                {filteredAlerts.map(alert => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className={`
                            mb-2 p-4 rounded-lg border
                            ${alert.type === 'error' ? 'bg-red-50 border-red-200' :
                                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                                    'bg-blue-50 border-blue-200'}
                        `}
                    >
                        <div className="flex justify-between">
                            <span className="font-medium">{alert.message}</span>
                            <span className="text-sm text-gray-500">
                                {new Date(alert.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                        {!alert.acknowledged && (
                            <button
                                onClick={() => {
                                    onAcknowledge(alert.id);
                                    setUnreadCount(prev => prev - 1);
                                }}
                                className="text-sm text-blue-500 hover:underline mt-2"
                            >
                                Marcar como leída
                            </button>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};