// src/components/navigation/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../models/User';

const routes = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        icon: 'ChartPieIcon',
        roles: [UserRole.ADMIN, UserRole.WAITER, UserRole.KITCHEN]
    },
    {
        path: '/orders',
        name: 'Orders',
        icon: 'ClipboardListIcon',
        roles: [UserRole.WAITER, UserRole.KITCHEN]
    },
    {
        path: '/kitchen',
        name: 'Kitchen Display',
        icon: 'FireIcon',
        roles: [UserRole.KITCHEN]
    },
    {
        path: '/admin',
        name: 'Administration',
        icon: 'CogIcon',
        roles: [UserRole.ADMIN]
    }
];

export const Sidebar: React.FC = () => {
    const { user } = useAuth();

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 h-screen">
            <nav className="mt-5 px-2">
                {routes
                    .filter(route => route.roles.includes(user?.role as UserRole))
                    .map(route => (
                        <NavLink
                            key={route.path}
                            to={route.path}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 mt-2 rounded-lg
                                ${isActive
                                    ? 'bg-gray-200 dark:bg-gray-700'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`
                            }
                        >
                            <span>{route.name}</span>
                        </NavLink>
                    ))
                }
            </nav>
        </aside>
    );
};