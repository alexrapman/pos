// src/components/ui/SnapPointAnimations.tsx
import React, { useState, useRef } from 'react';
import { useSpring, animated, config } from 'react-spring';
import { playWindowsSound } from '../../utils/windowsSounds';

interface SnapPointAnimationsProps {
    value: number;
    snapPoints: number[];
    onChange: (value: number) => void;
}

export const SnapPointAnimations: React.FC<SnapPointAnimationsProps> = ({
    value,
    snapPoints,
    onChange
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const dragStartValue = useRef(value);

    const { position } = useSpring({
        position: value,
        config: {
            ...config.gentle,
            tension: isDragging ? 0 : 170,
            friction: isDragging ? 0 : 26
        }
    });

    const findNearestSnapPoint = (currentValue: number): number => {
        return snapPoints.reduce((nearest, point) => {
            return Math.abs(currentValue - point) < Math.abs(currentValue - nearest)
                ? point
                : nearest;
        });
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        const nearestPoint = findNearestSnapPoint(value);

        if (nearestPoint !== value) {
            onChange(nearestPoint);
            playWindowsSound('snap');
        }
    };

    return (
        <animated.div
            style={{
                transform: position.to(p => `translateX(${p}px)`)
            }}
            onMouseDown={() => {
                setIsDragging(true);
                dragStartValue.current = value;
            }}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            className="cursor-grab active:cursor-grabbing"
        >
            {snapPoints.map((point, index) => (
                <div
                    key={index}
                    className={`
                        absolute h-4 w-0.5 bg-gray-300
                        transform -translate-x-1/2
                        transition-opacity duration-200
                        ${Math.abs(value - point) < 5 ? 'opacity-100' : 'opacity-50'}
                    `}
                    style={{ left: `${point}%` }}
                />
            ))}
        </animated.div>
    );
};