// src/components/accessibility/AccessibleTooltip.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccessibleTooltipProps {
    message: string;
    children: React.ReactNode;
}

export const AccessibleTooltip: React.FC<AccessibleTooltipProps> = ({
    message,
    children
}) => {
    const [visible, setVisible] = React.useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onFocus={() => setVisible(true)}
            onBlur={() => setVisible(false)}
        >
            {children}
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-black text-white text-sm rounded shadow-lg"
                        role="tooltip"
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};