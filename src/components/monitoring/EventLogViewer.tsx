// src/components/monitoring/EventLogViewer.tsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

interface EventLogEntry {
    id: number;
    type: string;
    source: string;
    message: string;
    timestamp: Date;
    category: string;
}

export const EventLogViewer: React.FC = () => {
    const [events, setEvents] = useState<EventLogEntry[]>([]);
    const [filter, setFilter] = useState({
        type: 'all',
        source: '',
        category: 'all'
    });

    useEffect(() => {
        const handleNewEvent = (event: EventLogEntry) => {
            setEvents(prev => [event, ...prev].slice(0, 1000)); // Keep last 1000 events
        };

        window.electron?.events.onNewEvent(handleNewEvent);
        return () => {
            window.electron?.events.removeListener('new-event', handleNewEvent);
        };
    }, []);

    const getEventIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'error':
                return <FiAlertCircle className="text-red-500" />;
            case 'warning':
                return <FiAlertTriangle className="text-yellow-500" />;
            default:
                return <FiInfo className="text-blue-500" />;
        }
    };

    const filteredEvents = events.filter(event => {
        return (filter.type === 'all' || event.type.toLowerCase() === filter.type) &&
            (filter.category === 'all' || event.category === filter.category) &&
            (!filter.source || event.source.toLowerCase().includes(filter.source.toLowerCase()));
    });

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-4 mb-4">
                <select
                    value={filter.type}
                    onChange={e => setFilter(prev => ({ ...prev, type: e.target.value }))}
                    className="border rounded px-2 py-1"
                >
                    <option value="all">All Types</option>
                    <option value="error">Error</option>
                    <option value="warning">Warning</option>
                    <option value="information">Information</option>
                </select>
                <input
                    type="text"
                    placeholder="Filter by source..."
                    value={filter.source}
                    onChange={e => setFilter(prev => ({ ...prev, source: e.target.value }))}
                    className="border rounded px-2 py-1"
                />
            </div>

            <div className="overflow-auto max-h-[600px]">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-2">Type</th>
                            <th className="p-2">Timestamp</th>
                            <th className="p-2">Source</th>
                            <th className="p-2">Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map(event => (
                            <tr key={`${event.id}-${event.timestamp}`} className="border-b">
                                <td className="p-2">{getEventIcon(event.type)}</td>
                                <td className="p-2">{format(new Date(event.timestamp), 'HH:mm:ss')}</td>
                                <td className="p-2">{event.source}</td>
                                <td className="p-2">{event.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};