// src/components/ui/Tooltip.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'right' | 'bottom' | 'left';
    delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    position = 'top',
    delay = 300
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
    const targetRef = useRef<HTMLDivElement>(null);
    let timeout: NodeJS.Timeout;

    const calculatePosition = () => {
        if (!targetRef.current) return;

        const rect = targetRef.current.getBoundingClientRect();
        const positions = {
            top: {
                x: rect.left + rect.width / 2,
                y: rect.top - 8
            },
            right: {
                x: rect.right + 8,
                y: rect.top + rect.height / 2
            },
            bottom: {
                x: rect.left + rect.width / 2,
                y: rect.bottom + 8
            },
            left: {
                x: rect.left - 8,
                y: rect.top + rect.height / 2
            }
        };

        setCoordinates(positions[position]);
    };

    const handleMouseEnter = () => {
        timeout = setTimeout(() => {
            calculatePosition();
            setIsVisible(true);
        }, delay);
    };

    const handleMouseLeave = () => {
        clearTimeout(timeout);
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div
            ref={targetRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="inline-block"
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed z-50 px-2 py-1 text-sm text-white bg-gray-800 rounded shadow-lg"
                        style={{
                            transform: 'translate(-50%, -50%)',
                            left: coordinates.x,
                            top: coordinates.y
                        }}
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};