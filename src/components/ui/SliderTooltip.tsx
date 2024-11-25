// src/components/ui/SliderTooltip.tsx
import React from 'react';

interface SliderTooltipProps {
    value: number;
    position: { x: number; y: number };
    visible: boolean;
    formatter?: (value: number) => string;
}

export const SliderTooltip: React.FC<SliderTooltipProps> = ({
    value,
    position,
    visible,
    formatter = (val) => val.toString()
}) => {
    if (!visible) return null;

    return (
        <div
            className="absolute bg-gray-800 text-white px-2 py-1 rounded text-sm transform -translate-x-1/2 -translate-y-full"
            style={{
                left: position.x,
                top: position.y - 8,
                opacity: visible ? 1 : 0,
                pointerEvents: 'none'
            }}
        >
            {formatter(value)}
            <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 border-4 border-transparent border-t-gray-800" />
        </div>
    );
};

// Updated Slider component with tooltips
import React, { useState, useRef, useEffect } from 'react';
import { SliderTooltip } from './SliderTooltip';

// ... previous Slider code ...

const [hoveredHandle, setHoveredHandle] = useState<number | null>(null);

return (
    <div role="group" aria-label="Range slider" className="h-6 relative">
        {value.map((val, index) => (
            <React.Fragment key={index}>
                <button
                    onMouseEnter={() => setHoveredHandle(index)}
                    onMouseLeave={() => setHoveredHandle(null)}
                // ... previous button props ...
                />
                <SliderTooltip
                    value={val}
                    position={{
                        x: ((val - min) / (max - min)) * 100,
                        y: 0
                    }}
                    visible={hoveredHandle === index}
                    formatter={props.formatter}
                />
            </React.Fragment>
        ))}
    </div>
);