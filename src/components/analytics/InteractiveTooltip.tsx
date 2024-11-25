// src/components/analysis/InteractiveTooltip.tsx
import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';

interface TooltipProps {
    metric: PerformanceMetric;
    position: { x: number; y: number };
    visible: boolean;
}

export const InteractiveTooltip: React.FC<TooltipProps> = ({
    metric,
    position,
    visible
}) => {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setShowDetails(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!visible) return null;

    return (
        <div
            ref={tooltipRef}
            className="absolute bg-white rounded-lg shadow-lg p-4 z-50 min-w-[200px]"
            style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -100%)'
            }}
        >
            <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">
                    {format(metric.timestamp, 'HH:mm:ss')}
                </span>
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-blue-500 text-sm hover:underline"
                >
                    {showDetails ? 'Less' : 'More'}
                </button>
            </div>

            <div className="space-y-1">
                <div className="flex justify-between">
                    <span>CPU:</span>
                    <span className="font-medium">{metric.cpu.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                    <span>Memory:</span>
                    <span className="font-medium">{metric.memory.toFixed(1)}%</span>
                </div>

                {showDetails && (
                    <>
                        <div className="border-t my-2"></div>
                        <div className="flex justify-between">
                            <span>Network Latency:</span>
                            <span className="font-medium">{metric.networkLatency}ms</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Disk I/O:</span>
                            <span className="font-medium">{metric.diskIO} MB/s</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};