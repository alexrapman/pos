// src/components/ui/Dialog.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface DialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg';
}

export const Dialog: React.FC<DialogProps> = ({
    open,
    onClose,
    title,
    children,
    maxWidth = 'md'
}) => {
    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg'
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black"
                        onClick={onClose}
                    />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className={`
                                bg-white rounded-lg shadow-xl
                                ${maxWidthClasses[maxWidth]}
                                w-full
                            `}
                        >
                            <div className="flex justify-between items-center p-4 border-b">
                                <h2 className="text-lg font-semibold">{title}</h2>
                                <button
                                    onClick={onClose}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                            {children}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};