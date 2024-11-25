// frontend/src/components/alerts/AlertNotification.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from '@heroicons/react/solid';
import { AlertThresholds } from '../../config/alertThresholds';

interface AlertNotificationProps {
  level: typeof AlertThresholds[keyof typeof AlertThresholds];
  message: string;
  duration?: number;
  onDismiss: () => void;
}

const severityStyles = {
  [AlertThresholds.CRITICAL]: {
    bg: 'bg-red-50',
    border: 'border-red-400',
    text: 'text-red-800',
    icon: 'text-red-400'
  },
  [AlertThresholds.WARNING]: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    text: 'text-yellow-800',
    icon: 'text-yellow-400'
  },
  [AlertThresholds.INFO]: {
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    text: 'text-blue-800',
    icon: 'text-blue-400'
  }
};

export const AlertNotification: React.FC<AlertNotificationProps> = ({
  level,
  message,
  duration = 5000,
  onDismiss
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  const styles = severityStyles[level];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`${styles.bg} ${styles.border} border rounded-lg p-4 mb-2`}
    >
      <div className="flex justify-between items-start">
        <div className={styles.text}>
          {message}
        </div>
        <button
          onClick={onDismiss}
          className={`${styles.icon} hover:opacity-75`}
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
};