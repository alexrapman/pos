// src/components/common/DateRangePicker.tsx
import React, { useState } from 'react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { FiCalendar, FiClock } from 'react-icons/fi';

interface DateRangePickerProps {
    value: [Date | null, Date | null];
    onChange: (range: [Date | null, Date | null]) => void;
}

const PRESETS = [
    { label: 'Last 24 hours', getValue: () => [subDays(new Date(), 1), new Date()] },
    { label: 'Last 7 days', getValue: () => [subDays(new Date(), 7), new Date()] },
    { label: 'Last 30 days', getValue: () => [subDays(new Date(), 30), new Date()] },
    { label: 'Today', getValue: () => [startOfDay(new Date()), endOfDay(new Date())] }
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handlePresetClick = (preset: typeof PRESETS[0]) => {
        onChange(preset.getValue() as [Date, Date]);
        setIsOpen(false);
    };

    const formatDateRange = (range: [Date | null, Date | null]): string => {
        if (!range[0] || !range[1]) return 'Select date range';
        return `${format(range[0], 'MMM dd, yyyy')} - ${format(range[1], 'MMM dd, yyyy')}`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between border rounded px-3 py-2"
            >
                <span>{formatDateRange(value)}</span>
                <FiCalendar className="text-gray-500" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
                    <div className="space-y-2">
                        {PRESETS.map((preset, index) => (
                            <button
                                key={index}
                                onClick={() => handlePresetClick(preset)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                        <div className="space-y-2">
                            <input
                                type="date"
                                value={value[0] ? format(value[0], 'yyyy-MM-dd') : ''}
                                onChange={e => onChange([new Date(e.target.value), value[1]])}
                                className="w-full border rounded px-3 py-2"
                            />
                            <input
                                type="date"
                                value={value[1] ? format(value[1], 'yyyy-MM-dd') : ''}
                                onChange={e => onChange([value[0], new Date(e.target.value)])}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};