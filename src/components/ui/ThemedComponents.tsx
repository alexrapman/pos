// src/components/ui/ThemedComponents.tsx
import React from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import { motion } from 'framer-motion';

export const ThemedButton: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
}> = ({ children, onClick, variant = 'primary' }) => {
    const { colors, isHighContrast } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                px-4 py-2 rounded
                ${isHighContrast
                    ? 'border-2 border-white'
                    : 'shadow-sm'
                }
                ${variant === 'primary'
                    ? `bg-${colors.primary} text-white`
                    : `bg-${colors.surface} text-${colors.text}`
                }
                transition-colors duration-200
            `}
            style={{
                backgroundColor: variant === 'primary' ? colors.primary : colors.surface,
                color: variant === 'primary' ? '#FFFFFF' : colors.text,
                outline: isHighContrast ? '2px solid white' : 'none'
            }}
        >
            {children}
        </motion.button>
    );
};

export const ThemedCard: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const { colors, isHighContrast } = useTheme();

    return (
        <div
            className={`
                p-4 rounded-lg
                ${isHighContrast ? 'border-2' : 'shadow-lg'}
            `}
            style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text
            }}
        >
            {children}
        </div>
    );
};