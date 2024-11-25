// src/components/accessibility/AccessibleModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FocusManager } from './FocusManager';

interface AccessibleModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
    isOpen,
    onClose,
    title,
    children
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                >
                    <FocusManager>
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 id="modal-title" className="text-xl font-bold">
                                    {title}
                                </h2>
                                <button
                                    onClick={onClose}
                                    aria-label="Cerrar modal"
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    &times;
                                </button>
                            </div>
                            <div>{children}</div>
                        </motion.div>
                    </FocusManager>
                </motion.div>
            )}
        </AnimatePresence>
    );
};