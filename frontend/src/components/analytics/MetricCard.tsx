// frontend/src/components/analytics/MetricCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/solid';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  prefix?: string;
  suffix?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  prefix,
  suffix
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow"
    >
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      
      <div className="mt-2 flex items-baseline">
        {prefix && <span className="text-gray-500 mr-1">{prefix}</span>}
        <span className="text-2xl font-semibold">{value}</span>
        {suffix && <span className="text-gray-500 ml-1">{suffix}</span>}
      </div>

      {change !== undefined && (
        <div className={`mt-2 flex items-center text-sm ${
          change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {change >= 0 ? (
            <ArrowUpIcon className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 mr-1" />
          )}
          <span>{Math.abs(change)}%</span>
          <span className="ml-2 text-gray-500">vs last period</span>
        </div>
      )}
    </motion.div>
  );
};