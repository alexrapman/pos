// src/components/accessibility/AccessibleDialog.tsx
import React, { useEffect, useRef } from 'react';
import { FocusManager } from './FocusManager';

interface AccessibleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const AccessibleDialog: React.FC<AccessibleDialogProps> = ({
    isOpen,
    onClose,
    title,
    children
}) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        } else {
            document.removeEventListener('keydown', handleKeyDown);
        }

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
            <FocusManager>
                <div
                    ref={dialogRef}
                    className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 id="dialog-title" className="text-xl font-bold">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            aria-label="Cerrar diálogo"
                            className="text-gray-500 hover:text-gray-700"
                        >
                            &times;
                        </button>
                    </div>
                    <div>{children}</div>
                </div>
            </FocusManager>
        </div>
    );
};