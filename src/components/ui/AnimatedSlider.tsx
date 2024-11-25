// src/components/ui/AnimatedSlider.tsx
import React, { useState, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { usePrevious } from '../../hooks/usePrevious';

interface AnimatedSliderProps extends SliderProps {
    animationConfig?: {
        tension?: number;
        friction?: number;
    };
}

export const AnimatedSlider: React.FC<AnimatedSliderProps> = ({
    value,
    onChange,
    min,
    max,
    step = 1,
    disabled = false,
    animationConfig = { tension: 170, friction: 26 }
}) => {
    const prevValue = usePrevious(value);
    const [isDragging, setIsDragging] = useState(false);

    const springs = value.map((val, index) =>
        useSpring({
            value: val,
            from: { value: prevValue?.[index] ?? val },
            config: {
                ...animationConfig,
                immediate: isDragging
            }
        })
    );

    return (
        <div className="relative h-6">
            {/* Track */}
            <div className="absolute h-2 w-full bg-gray-200 rounded-full top-2">
                <animated.div
                    className="absolute h-full bg-blue-500 rounded-full"
                    style={{
                        left: springs[0].value.to(v => `${((v - min) / (max - min)) * 100}%`),
                        right: springs[1].value.to(v => `${100 - ((v - min) / (max - min)) * 100}%`)
                    }}
                />
            </div>

            {/* Handles */}
            {springs.map((spring, index) => (
                <animated.button
                    key={index}
                    className={`
                        absolute top-0 w-6 h-6 rounded-full bg-white 
                        border-2 border-blue-500 transform -translate-x-1/2
                        transition-shadow duration-200
                        ${disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}
                        ${isDragging ? 'shadow-lg scale-110' : ''}
                    `}
                    style={{
                        left: spring.value.to(v => `${((v - min) / (max - min)) * 100}%`)
                    }}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                />
            ))}
        </div>
    );
};