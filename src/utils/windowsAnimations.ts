// src/utils/windowsAnimations.ts
export const windowsAnimations = {
    easing: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        windows: 'cubic-bezier(0.17, 0.89, 0.32, 1.28)'
    },
    durations: {
        fast: 150,
        normal: 300,
        slow: 500
    }
};

// src/components/ui/AnimatedProgressBar.tsx
import React, { useEffect, useRef } from 'react';
import { windowsAnimations } from '../../utils/windowsAnimations';

interface AnimatedProgressBarProps {
    progress: number;
    color?: string;
    height?: number;
    animated?: boolean;
}

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
    progress,
    color = '#0078D4',
    height = 4,
    animated = true
}) => {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!barRef.current) return;

        const animation = barRef.current.animate([
            { transform: 'scaleX(0)' },
            { transform: `scaleX(${progress / 100})` }
        ], {
            duration: windowsAnimations.durations.normal,
            easing: windowsAnimations.easing.windows,
            fill: 'forwards'
        });

        return () => animation.cancel();
    }, [progress]);

    return (
        <div 
            className= "w-full overflow-hidden rounded-full"
    style = {{ height }
}
        >
    <div 
                ref={ barRef }
className = {`h-full w-full transform origin-left transition-transform
                    ${animated ? 'animate-pulse' : ''}`}
style = {{
    backgroundColor: color,
        transform: `scaleX(${progress / 100})`
}}
            />
    </div>
    );
};