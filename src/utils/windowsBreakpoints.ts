// src/utils/windowsBreakpoints.ts
import { useState, useEffect } from 'react';

const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
};

export const useWindowsBreakpoints = () => {
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
        dpi: window.devicePixelRatio
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
                dpi: window.devicePixelRatio
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        isMobile: screenSize.width < breakpoints.md,
        isTablet: screenSize.width >= breakpoints.md && screenSize.width < breakpoints.lg,
        isDesktop: screenSize.width >= breakpoints.lg,
        isHighDPI: screenSize.dpi > 1,
        ...screenSize
    };
};

// src/components/layout/ResponsiveLayout.tsx
import React from 'react';
import { useWindowsBreakpoints } from '../../utils/windowsBreakpoints';
import { ThemedLayout } from './ThemedLayout';

export const ResponsiveLayout: React.FC<{
    children: React.ReactNode;
    sidebar?: React.ReactNode;
}> = ({ children, sidebar }) => {
    const { isMobile, isHighDPI } = useWindowsBreakpoints();

    return (
        <ThemedLayout
            sidebar= {!isMobile && sidebar
}
className = {`${isHighDPI ? 'scale-125' : ''}`}
        >
    { children }
    </ThemedLayout>
    );
};