// src/components/monitoring/MetricCard.tsx
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface MetricCardProps {
    title: string;
    value: number;
    type: 'percentage' | 'bytes' | 'number';
    color: 'blue' | 'green' | 'yellow' | 'red';
    previousValue?: number;
}

const formatValue = (value: number, type: string): string => {
    switch (type) {
        case 'percentage':
            return `${value.toFixed(1)}%`;
        case 'bytes':
            return formatBytes(value);
        default:
            return value.toFixed(0);
    }
};

const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

export const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    type,
    color,
    previousValue
}) => {
    const prevValue = useRef(value);
    const trend = value > (previousValue ?? prevValue.current) ? 'up' : 'down';

    useEffect(() => {
        prevValue.current = value;
    }, [value]);

    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        green: 'bg-green-50 border-green-200 text-green-700',
        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        red: 'bg-red-50 border-red-200 text-red-700'
    };

    return (
        <motion.div
            className={`p-4 rounded-lg border ${colorClasses[color]}`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
        >
            <h3 className="text-sm font-medium mb-2">{title}</h3>

            <div className="flex items-center justify-between">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={value}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        className="text-2xl font-bold"
                    >
                        {formatValue(value, type)}
                    </motion.div>
                </AnimatePresence>

                {trend === 'up' ? (
                    <FiTrendingUp className="w-5 h-5" />
                ) : (
                    <FiTrendingDown className="w-5 h-5" />
                )}
            </div>

            {type === 'percentage' && (
                <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full ${color === 'red' ? 'bg-red-500' : `bg-${color}-500`}`}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            )}
        </motion.div>
    );
};