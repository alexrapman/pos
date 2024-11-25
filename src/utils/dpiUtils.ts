// src/utils/dpiUtils.ts
import { useEffect, useState } from 'react';

export const getDpiScale = (): number => {
    if (typeof window === 'undefined') return 1;
    return window.devicePixelRatio || 1;
};

export const useDpiAware = () => {
    const [dpiScale, setDpiScale] = useState(getDpiScale());

    useEffect(() => {
        const updateDpiScale = () => setDpiScale(getDpiScale());
        window.matchMedia(`(resolution: ${dpiScale}dppx)`).addListener(updateDpiScale);
        return () => {
            window.matchMedia(`(resolution: ${dpiScale}dppx)`).removeListener(updateDpiScale);
        };
    }, [dpiScale]);

    return dpiScale;
};

// src/components/ui/DpiAwareComponent.tsx
import React from 'react';
import { useDpiAware } from '../../utils/dpiUtils';

export const DpiAwareComponent: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => {
    const dpiScale = useDpiAware();

    const scaledStyle = {
        transform: `scale(${dpiScale})`,
        transformOrigin: 'top left'
    };

    return (
        <div style= { scaledStyle } className = { className } >
            { children }
            </div>
    );
};