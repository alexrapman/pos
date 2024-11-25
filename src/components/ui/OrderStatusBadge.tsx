// src/components/ui/OrderStatusBadge.tsx
import React from 'react';
import { OrderStatus } from '../../models/Order';

const statusColors: Record<OrderStatus, { bg: string; text: string }> = {
    [OrderStatus.PENDING]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    [OrderStatus.PREPARING]: { bg: 'bg-blue-100', text: 'text-blue-800' },
    [OrderStatus.READY]: { bg: 'bg-green-100', text: 'text-green-800' },
    [OrderStatus.DELIVERED]: { bg: 'bg-gray-100', text: 'text-gray-800' },
    [OrderStatus.CANCELLED]: { bg: 'bg-red-100', text: 'text-red-800' }
};

interface OrderStatusBadgeProps {
    status: OrderStatus;
    size?: 'sm' | 'md' | 'lg';
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
    status,
    size = 'md'
}) => {
    const { bg, text } = statusColors[status];
    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    return (
        <span className={`
            inline-flex items-center rounded-full
            font-medium
            ${bg} ${text} ${sizeClasses[size]}
        `}>
            {status}
        </span>
    );
};