// src/components/dashboard/RestaurantDashboard.tsx
import React, { useState, useEffect, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useOrderSync } from '../../hooks/useOrderSync';
import { useAnalytics } from '../../hooks/useAnalytics';

const OrdersOverview = React.lazy(() => import('./OrdersOverview'));
const KitchenStatus = React.lazy(() => import('./KitchenStatus'));
const StaffManagement = React.lazy(() => import('./StaffManagement'));

export const RestaurantDashboard: React.FC = () => {
    const { orders, connected, loading: ordersLoading } = useOrderSync();
    const { analytics, loading: analyticsLoading } = useAnalytics();
    const [selectedView, setSelectedView] = useState<'orders' | 'kitchen' | 'staff'>('orders');

    const LoadingFallback = () => (
        <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
        </div>
    );

    const ErrorFallback = ({ error, resetErrorBoundary }: any) => (
        <div className="text-center p-4">
            <h3 className="text-red-600 font-bold">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
                onClick={resetErrorBoundary}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Try again
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow transition-all duration-300">
                <div className="max-w-7xl mx-auto py-6 px-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Restaurant Dashboard
                        </h1>
                        {(ordersLoading || analyticsLoading) && (
                            <LoadingSpinner size="sm" />
                        )}
                    </div>
                    {!connected && (
                        <div className="mt-2 text-red-600 animate-pulse">
                            ⚠️ Connection Lost - Trying to reconnect...
                        </div>
                    )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Suspense fallback={<LoadingFallback />}>
                        {selectedView === 'orders' && (
                            <OrdersOverview
                                orders={orders}
                                loading={ordersLoading}
                            />
                        )}
                        {selectedView === 'kitchen' && <KitchenStatus />}
                        {selectedView === 'staff' && <StaffManagement />}
                    </Suspense>
                </ErrorBoundary>
            </main>
        </div>
    );
};