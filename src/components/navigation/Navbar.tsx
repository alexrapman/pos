// src/components/navigation/Navbar.tsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from '../ui/ThemeToggle';
import { NotificationBell } from '../ui/NotificationBell';

export const Navbar: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-xl font-bold">
                            Restaurant POS
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <ThemeToggle />
                        <div className="relative">
                            <button className="flex items-center gap-2">
                                <img
                                    src={`/avatars/${user?.id}.jpg`}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full"
                                />
                                <span>{user?.username}</span>
                            </button>
                            <button
                                onClick={logout}
                                className="text-red-500 hover:text-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};