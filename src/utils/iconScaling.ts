// src/utils/iconScaling.ts
import { useDpiAware } from './dpiUtils';

interface IconSet {
    '1x': string;
    '1.25x': string;
    '1.5x': string;
    '2x': string;
    '4x': string;
}

export const getScaledIconPath = (iconSet: IconSet, scale: number): string => {
    if (scale >= 4) return iconSet['4x'];
    if (scale >= 2) return iconSet['2x'];
    if (scale >= 1.5) return iconSet['1.5x'];
    if (scale >= 1.25) return iconSet['1.25x'];
    return iconSet['1x'];
};

// src/components/ui/ScaledIcon.tsx
import React from 'react';
import { useDpiAware } from '../../utils/dpiUtils';
import { getScaledIconPath } from '../../utils/iconScaling';

export const ScaledIcon: React.FC<{
    iconSet: IconSet;
    alt: string;
    className?: string;
}> = ({ iconSet, alt, className = '' }) => {
    const dpiScale = useDpiAware();
    const iconPath = getScaledIconPath(iconSet, dpiScale);

    return (
        <img
            src= { iconPath }
    alt = { alt }
    className = {`w-full h-full object-contain ${className}`
}
style = {{
    imageRendering: 'high-quality',
        WebkitFontSmoothing: 'antialiased'
}}
        />
    );
};