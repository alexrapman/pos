// src/components/monitoring/MetricCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from '../ui/Tooltip';
import { FiAlertTriangle } from 'react-icons/fi';

interface MetricCardProps {
    title: string;
    value: number;
    unit: string;
    alert: boolean;
    description?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    unit,
    alert,
    description
}) => {
    return (
        <motion.div
            className={`
                p-4 rounded-lg shadow-lg
                ${alert ? 'bg-red-50 border-red-500' : 'bg-white'}
                border transition-colors duration-200
            `}
            whileHover={{ scale: 1.02 }}
            animate={{
                borderColor: alert ? '#ef4444' : '#e5e7eb'
            }}
        >
            <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
                {alert && (
                    <Tooltip content="Performance alert">
                        <FiAlertTriangle className="w-5 h-5 text-red-500" />
                    </Tooltip>
                )}
            </div>

            <div className="mt-2 flex items-baseline">
                <motion.span
                    className={`
                        text-2xl font-semibold
                        ${alert ? 'text-red-600' : 'text-gray-900'}
                    `}
                    animate={{ scale: alert ? [1, 1.1, 1] }}
                    transition={{ duration: 0.3 }}
                >
                    {value}
                </motion.span>
                <span className="ml-1 text-gray-500">{unit}</span>
            </div>

            {description && (
                <p className="mt-2 text-sm text-gray-500">{description}</p>
            )}
        </motion.div>
    );
};