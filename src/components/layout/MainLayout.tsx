// src/components/layout/MainLayout.tsx
import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ThemeProvider } from '../providers/ThemeProvider';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <Navbar />
                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 p-6">
                        {children}
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
};