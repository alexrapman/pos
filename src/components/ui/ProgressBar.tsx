// src/components/ui/ProgressBar.tsx
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface ProgressBarProps {
    progress: number;
    className?: string;
    color?: 'blue' | 'green' | 'red';
    showLabel?: boolean;
    animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    className = '',
    color = 'blue',
    showLabel = true,
    animated = true
}) => {
    const [displayProgress, setDisplayProgress] = useState(0);
    const { isDark } = useTheme();

    useEffect(() => {
        // Animación suave
        const animationFrame = requestAnimationFrame(() => {
            setDisplayProgress(progress);
        });

        return () => cancelAnimationFrame(animationFrame);
    }, [progress]);

    const getColorClasses = () => {
        const colors = {
            blue: isDark ? 'bg-blue-600' : 'bg-blue-500',
            green: isDark ? 'bg-green-600' : 'bg-green-500',
            red: isDark ? 'bg-red-600' : 'bg-red-500'
        };
        return colors[color];
    };

    return (
        <div className="space-y-1">
            {showLabel && (
                <div className="flex justify-between text-sm">
                    <span>Progreso</span>
                    <span>{Math.round(displayProgress)}%</span>
                </div>
            )}

            <div className={`
                relative h-2 bg-gray-200 rounded-full overflow-hidden
                ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
                ${className}
            `}>
                <div
                    className={`
                        absolute left-0 top-0 h-full rounded-full
                        transition-all duration-300 ease-out
                        ${getColorClasses()}
                        ${animated ? 'animate-pulse' : ''}
                    `}
                    style={{ width: `${displayProgress}%` }}
                />
            </div>
        </div>
    );
};