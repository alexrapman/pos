// src/components/dashboard/OrdersOverview.tsx
import React, { useState, useMemo } from 'react';
import { Order, OrderStatus } from '../../models/Order';
import { SearchInput } from '../ui/SearchInput';
import { OrderStatusBadge } from '../ui/OrderStatusBadge';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { SkeletonLoader } from '../ui/SkeletonLoader';
import { useToastUtils } from '../../utils/toastUtils';

interface OrdersOverviewProps {
    orders: Order[];
    loading: boolean;
}

export const OrdersOverview: React.FC<OrdersOverviewProps> = ({ orders, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<'date' | 'table' | 'amount'>('date');
    const { notifySuccess } = useToastUtils();

    const filteredOrders = useMemo(() => {
        return orders
            .filter(order => {
                const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.tableNumber.toString().includes(searchTerm);
                const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'date':
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    case 'table':
                        return a.tableNumber - b.tableNumber;
                    case 'amount':
                        return b.total - a.total;
                    default:
                        return 0;
                }
            });
    }, [orders, searchTerm, statusFilter, sortBy]);

    const handleOrderAction = (action: string) => {
        notifySuccess(`Order ${action} successfully`);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Orders Overview</h2>
                <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search orders..."
                />
            </div>

            <div className="flex gap-2 mb-4">
                {['ALL', ...Object.values(OrderStatus)].map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status as OrderStatus | 'ALL')}
                        className={`px-3 py-1 rounded ${statusFilter === status
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-4">
                    <SkeletonLoader count={5} height="h-6" />
                </div>
            ) : (
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2">Order ID</th>
                            <th className="text-left py-2">Table</th>
                            <th className="text-left py-2">Status</th>
                            <th className="text-right py-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="py-2">{order.id}</td>
                                <td className="py-2">Table {order.tableNumber}</td>
                                <td className="py-2">
                                    <OrderStatusBadge status={order.status} />
                                </td>
                                <td className="py-2 text-right">
                                    ${order.total.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};