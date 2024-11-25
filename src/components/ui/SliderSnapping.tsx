// src/components/ui/SliderSnapping.tsx
import React, { useMemo } from 'react';

interface SnapPoint {
    value: number;
    position: number;
}

export const calculateSnapPoints = (min: number, max: number, step: number): SnapPoint[] => {
    const points: SnapPoint[] = [];
    for (let value = min; value <= max; value += step) {
        points.push({
            value,
            position: ((value - min) / (max - min)) * 100
        });
    }
    return points;
};

// Updated Slider component with snapping
export const Slider: React.FC<SliderProps> = ({
    value,
    onChange,
    min,
    max,
    step = 1,
    disabled = false
}) => {
    const snapPoints = useMemo(() =>
        calculateSnapPoints(min, max, step),
        [min, max, step]
    );

    const findNearestSnapPoint = (value: number): number => {
        return snapPoints.reduce((nearest, point) => {
            const currentDiff = Math.abs(value - nearest);
            const newDiff = Math.abs(value - point.value);
            return newDiff < currentDiff ? point.value : nearest;
        }, snapPoints[0].value);
    };

    const handleDrag = (percentage: number, index: number) => {
        const rawValue = min + ((max - min) * percentage) / 100;
        const snappedValue = findNearestSnapPoint(rawValue);

        const newValues = [...value];
        newValues[index] = snappedValue;

        if ((index === 0 && snappedValue <= value[1]) ||
            (index === 1 && snappedValue >= value[0])) {
            onChange(newValues);
        }
    };

    return (
        <div className="relative h-6">
            {/* Snap point indicators */}
            {snapPoints.map((point) => (
                <div
                    key={point.value}
                    className="absolute w-0.5 h-1 bg-gray-300 transform -translate-x-1/2"
                    style={{ left: `${point.position}%`, bottom: 0 }}
                />
            ))}
            {/* Existing slider implementation */}
        </div>
    );
};