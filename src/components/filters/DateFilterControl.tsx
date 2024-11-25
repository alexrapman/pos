// src/components/filters/DateFilterControl.tsx
import React, { useState, useEffect } from 'react';
import { DateRangeUtils } from '../../utils/dateRangeUtils';
import { Slider } from '../ui/Slider';
import { format } from 'date-fns';

interface DateFilterProps {
    onChange: (range: { start: Date; end: Date }) => void;
    initialRange?: { start: Date; end: Date };
}

export const DateFilterControl: React.FC<DateFilterProps> = ({
    onChange,
    initialRange
}) => {
    const [range, setRange] = useState(initialRange || DateRangeUtils.getRelativeRange('day', 1));
    const [presetKey, setPresetKey] = useState<string>('custom');
    const [sliderValue, setSliderValue] = useState([0, 100]);

    const presets = [
        { key: 'hour', label: 'Last Hour', range: DateRangeUtils.getRelativeRange('day', 1 / 24) },
        { key: '24h', label: 'Last 24 Hours', range: DateRangeUtils.getRelativeRange('day', 1) },
        { key: '7d', label: 'Last 7 Days', range: DateRangeUtils.getRelativeRange('day', 7) },
        { key: '30d', label: 'Last 30 Days', range: DateRangeUtils.getRelativeRange('day', 30) }
    ];

    useEffect(() => {
        onChange(range);
    }, [range]);

    const handlePresetChange = (preset: typeof presets[0]) => {
        setPresetKey(preset.key);
        setRange(preset.range);
        setSliderValue([0, 100]);
    };

    const handleSliderChange = (values: number[]) => {
        const totalMs = range.end.getTime() - range.start.getTime();
        const newStart = new Date(range.start.getTime() + (totalMs * values[0] / 100));
        const newEnd = new Date(range.start.getTime() + (totalMs * values[1] / 100));
        setRange({ start: newStart, end: newEnd });
    };

    return (
        <div className="space-y-4">
            <div className="flex space-x-2">
                {presets.map(preset => (
                    <button
                        key={preset.key}
                        onClick={() => handlePresetChange(preset)}
                        className={`px-3 py-1 rounded ${presetKey === preset.key
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100'
                            }`}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            <div className="px-4">
                <Slider
                    value={sliderValue}
                    onChange={handleSliderChange}
                    min={0}
                    max={100}
                    step={1}
                />
            </div>

            <div className="flex justify-between text-sm text-gray-600">
                <span>{format(range.start, 'PPpp')}</span>
                <span>{format(range.end, 'PPpp')}</span>
            </div>
        </div>
    );
};