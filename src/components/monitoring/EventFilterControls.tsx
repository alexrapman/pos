// src/components/monitoring/EventFilterControls.tsx
import React, { useState } from 'react';
import { DateRangePicker } from '../common/DateRangePicker';
import { debounce } from 'lodash';

interface FilterOptions {
    type: string;
    source: string;
    category: string;
    severity: string[];
    dateRange: [Date | null, Date | null];
    searchTerm: string;
}

interface EventFilterProps {
    onFilterChange: (filters: FilterOptions) => void;
    initialFilters?: Partial<FilterOptions>;
}

export const EventFilterControls: React.FC<EventFilterProps> = ({
    onFilterChange,
    initialFilters = {}
}) => {
    const [filters, setFilters] = useState<FilterOptions>({
        type: 'all',
        source: '',
        category: 'all',
        severity: [],
        dateRange: [null, null],
        searchTerm: '',
        ...initialFilters
    });

    const handleFilterChange = debounce((newFilters: Partial<FilterOptions>) => {
        const updated = { ...filters, ...newFilters };
        setFilters(updated);
        onFilterChange(updated);
    }, 300);

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Event Type</label>
                    <select
                        value={filters.type}
                        onChange={e => handleFilterChange({ type: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="all">All Types</option>
                        <option value="error">Error</option>
                        <option value="warning">Warning</option>
                        <option value="information">Information</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Source</label>
                    <input
                        type="text"
                        value={filters.source}
                        onChange={e => handleFilterChange({ source: e.target.value })}
                        placeholder="Filter by source..."
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Date Range</label>
                <DateRangePicker
                    value={filters.dateRange}
                    onChange={range => handleFilterChange({ dateRange: range })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Search</label>
                <input
                    type="text"
                    value={filters.searchTerm}
                    onChange={e => handleFilterChange({ searchTerm: e.target.value })}
                    placeholder="Search in event messages..."
                    className="w-full border rounded px-3 py-2"
                />
            </div>
        </div>
    );
};