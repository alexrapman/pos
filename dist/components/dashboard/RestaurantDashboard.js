"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantDashboard = void 0;
// src/components/dashboard/RestaurantDashboard.tsx
const react_1 = __importStar(require("react"));
const react_error_boundary_1 = require("react-error-boundary");
const LoadingSpinner_1 = require("../ui/LoadingSpinner");
const useOrderSync_1 = require("../../hooks/useOrderSync");
const useAnalytics_1 = require("../../hooks/useAnalytics");
const OrdersOverview = react_1.default.lazy(() => Promise.resolve().then(() => __importStar(require('./OrdersOverview'))));
const KitchenStatus = react_1.default.lazy(() => Promise.resolve().then(() => __importStar(require('./KitchenStatus'))));
const StaffManagement = react_1.default.lazy(() => Promise.resolve().then(() => __importStar(require('./StaffManagement'))));
const RestaurantDashboard = () => {
    const { orders, connected, loading: ordersLoading } = (0, useOrderSync_1.useOrderSync)();
    const { analytics, loading: analyticsLoading } = (0, useAnalytics_1.useAnalytics)();
    const [selectedView, setSelectedView] = (0, react_1.useState)('orders');
    const LoadingFallback = () => (<div className="flex justify-center items-center h-64">
            <LoadingSpinner_1.LoadingSpinner size="lg"/>
        </div>);
    const ErrorFallback = ({ error, resetErrorBoundary }) => (<div className="text-center p-4">
            <h3 className="text-red-600 font-bold">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button onClick={resetErrorBoundary} className="bg-blue-500 text-white px-4 py-2 rounded">
                Try again
            </button>
        </div>);
    return (<div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow transition-all duration-300">
                <div className="max-w-7xl mx-auto py-6 px-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Restaurant Dashboard
                        </h1>
                        {(ordersLoading || analyticsLoading) && (<LoadingSpinner_1.LoadingSpinner size="sm"/>)}
                    </div>
                    {!connected && (<div className="mt-2 text-red-600 animate-pulse">
                            ⚠️ Connection Lost - Trying to reconnect...
                        </div>)}
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <react_error_boundary_1.ErrorBoundary FallbackComponent={ErrorFallback}>
                    <react_1.Suspense fallback={<LoadingFallback />}>
                        {selectedView === 'orders' && (<OrdersOverview orders={orders} loading={ordersLoading}/>)}
                        {selectedView === 'kitchen' && <KitchenStatus />}
                        {selectedView === 'staff' && <StaffManagement />}
                    </react_1.Suspense>
                </react_error_boundary_1.ErrorBoundary>
            </main>
        </div>);
};
exports.RestaurantDashboard = RestaurantDashboard;
