// mobile/components/NotificationList.js
import React, { useEffect, useState } from 'react';

export default function NotificationList() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const response = await fetch('/api/notifications', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setNotifications(data);
        };

        fetchNotifications();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Notificaciones</h1>
            <ul>
                {notifications.map(notification => (
                    <li key={notification.id} className={`p-4 mb-2 rounded ${notification.type === 'error' ? 'bg-red-100' : notification.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                        <p>{notification.message}</p>
                        <small>{new Date(notification.timestamp).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}