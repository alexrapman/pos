// src/components/accessibility/FocusManager.tsx
import React, { useEffect, useRef } from 'react';

interface FocusManagerProps {
    children: React.ReactNode;
    active?: boolean;
    restoreFocus?: boolean;
    autoFocus?: boolean;
}

export const FocusManager: React.FC<FocusManagerProps> = ({
    children,
    active = true,
    restoreFocus = true,
    autoFocus = true
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (active) {
            previousFocusRef.current = document.activeElement as HTMLElement;

            if (autoFocus) {
                const firstFocusable = getFocusableElements()[0];
                firstFocusable?.focus();
            }
        }

        return () => {
            if (restoreFocus && previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        };
    }, [active, autoFocus, restoreFocus]);

    const getFocusableElements = () => {
        if (!containerRef.current) return [];

        return Array.from(
            containerRef.current.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
        );
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (!active || event.key !== 'Tab') return;

        const focusableElements = getFocusableElements();
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
        } else if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
        }
    };

    return (
        <div
            ref={containerRef}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            className="focus-manager"
        >
            {children}
        </div>
    );
};