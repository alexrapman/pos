// src/components/ui/Slider.tsx
import React, { useState, useRef, useEffect } from 'react';
import { clamp } from '../../utils/math';

interface SliderProps {
    value: number[];
    onChange: (values: number[]) => void;
    min: number;
    max: number;
    step?: number;
    disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
    value,
    onChange,
    min,
    max,
    step = 1,
    disabled = false
}) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState<number | null>(null);
    const [focusedHandle, setFocusedHandle] = useState<number | null>(null);
    const handleRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const getPercentage = (value: number): number => {
        return ((value - min) / (max - min)) * 100;
    };

    const getValue = (percentage: number): number => {
        const rawValue = ((max - min) * percentage) / 100 + min;
        const steps = Math.round((rawValue - min) / step);
        return clamp(min + (steps * step), min, max);
    };

    const handleMouseDown = (event: React.MouseEvent, index: number) => {
        if (disabled) return;
        setDragging(index);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (dragging === null || !trackRef.current) return;

        const rect = trackRef.current.getBoundingClientRect();
        const percentage = clamp(
            ((event.clientX - rect.left) / rect.width) * 100,
            0,
            100
        );

        const newValue = getValue(percentage);
        const newValues = [...value];
        newValues[dragging] = newValue;

        // Ensure handles don't cross
        if (dragging === 0 && newValue <= value[1]) {
            onChange(newValues);
        } else if (dragging === 1 && newValue >= value[0]) {
            onChange(newValues);
        }
    };

    const handleMouseUp = () => {
        setDragging(null);
    };

    const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
        if (disabled) return;

        const currentValue = value[index];
        let newValue = currentValue;

        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowDown':
                newValue = currentValue - step;
                break;
            case 'ArrowRight':
            case 'ArrowUp':
                newValue = currentValue + step;
                break;
            case 'PageUp':
                newValue = currentValue + (step * 10);
                break;
            case 'PageDown':
                newValue = currentValue - (step * 10);
                break;
            case 'Home':
                newValue = min;
                break;
            case 'End':
                newValue = max;
                break;
            default:
                return;
        }

        event.preventDefault();

        newValue = clamp(newValue, min, max);
        const newValues = [...value];

        if ((index === 0 && newValue <= value[1]) ||
            (index === 1 && newValue >= value[0])) {
            newValues[index] = newValue;
            onChange(newValues);
        }
    };

    useEffect(() => {
        if (dragging !== null) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [dragging]);

    return (
        <div
            role="group"
            aria-label="Range slider"
            className={`h-6 relative ${disabled ? 'opacity-50' : ''}`}
            ref={trackRef}
        >
            <div className="absolute h-2 w-full bg-gray-200 rounded-full top-2">
                <div
                    className="absolute h-full bg-blue-500 rounded-full"
                    style={{
                        left: `${getPercentage(value[0])}%`,
                        right: `${100 - getPercentage(value[1])}%`
                    }}
                />
            </div>
            {value.map((val, index) => (
                <button
                    key={index}
                    ref={el => handleRefs.current[index] = el}
                    onMouseDown={(e) => handleMouseDown(e, index)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    onFocus={() => setFocusedHandle(index)}
                    onBlur={() => setFocusedHandle(null)}
                    role="slider"
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={val}
                    aria-label={`Slider handle ${index + 1}`}
                    tabIndex={disabled ? -1 : 0}
                    className={`
                        absolute top-0 w-6 h-6 rounded-full bg-white border-2 
                        border-blue-500 transform -translate-x-1/2
                        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                        ${dragging === index ? 'shadow-lg scale-110' : ''}
                        ${focusedHandle === index ? 'ring-2 ring-blue-300' : ''}
                    `}
                    style={{ left: `${getPercentage(val)}%` }}
                    disabled={disabled}
                />
            ))}
        </div>
    );
};