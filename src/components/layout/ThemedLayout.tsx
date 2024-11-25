// src/components/layout/ThemedLayout.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../providers/ThemeProvider';

export const ThemedLayout: React.FC<{
    children: React.ReactNode;
    sidebar?: React.ReactNode;
}> = ({ children, sidebar }) => {
    const { colors, isHighContrast } = useTheme();

    return (
        <div
            className="min-h-screen flex"
            style={{ backgroundColor: colors.background }}
        >
            {sidebar && (
                <motion.div
                    initial={{ x: -250 }}
                    animate={{ x: 0 }}
                    className="w-64 border-r"
                    style={{
                        backgroundColor: colors.surface,
                        borderColor: isHighContrast ? colors.text : colors.border
                    }}
                >
                    {sidebar}
                </motion.div>
            )}
            <main className="flex-1 overflow-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export const ThemedHeader: React.FC<{
    title: string;
    actions?: React.ReactNode;
}> = ({ title, actions }) => {
    const { colors, isHighContrast } = useTheme();

    return (
        <header
            className="px-6 py-4 flex justify-between items-center border-b"
            style={{
                backgroundColor: colors.surface,
                borderColor: isHighContrast ? colors.text : colors.border,
                color: colors.text
            }}
        >
            <h1 className="text-xl font-bold">{title}</h1>
            {actions && (
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            )}
        </header>
    );
};