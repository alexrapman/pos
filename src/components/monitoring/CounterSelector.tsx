// src/components/monitoring/CounterSelector.tsx
import React, { useState, useEffect } from 'react';
import { Tree } from '../ui/Tree';
import { SearchInput } from '../ui/SearchInput';
import { Tooltip } from '../ui/Tooltip';
import { FiSearch, FiCheck, FiInfo } from 'react-icons/fi';

interface CounterSelectorProps {
    onSelectionChange: (counters: string[]) => void;
    initialSelection?: string[];
}

export const CounterSelector: React.FC<CounterSelectorProps> = ({
    onSelectionChange,
    initialSelection = []
}) => {
    const [categories, setCategories] = useState<Map<string, string[]>>(new Map());
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCounters, setSelectedCounters] = useState<Set<string>>(
        new Set(initialSelection)
    );

    useEffect(() => {
        const loadCounters = async () => {
            const counters = await window.electron?.performance.discoverCounters();
            setCategories(counters || new Map());
        };
        loadCounters();
    }, []);

    const handleCounterToggle = (counterId: string) => {
        const newSelection = new Set(selectedCounters);
        if (newSelection.has(counterId)) {
            newSelection.delete(counterId);
        } else {
            newSelection.add(counterId);
        }
        setSelectedCounters(newSelection);
        onSelectionChange(Array.from(newSelection));
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <div className="mb-4">
                <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search counters..."
                    icon={<FiSearch />}
                />
            </div>

            <div className="max-h-96 overflow-y-auto">
                {Array.from(categories.entries()).map(([category, counters]) => {
                    const filteredCounters = counters.filter(counter =>
                        counter.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    if (filteredCounters.length === 0) return null;

                    return (
                        <div key={category} className="mb-4">
                            <h3 className="font-semibold mb-2">{category}</h3>
                            {filteredCounters.map(counter => {
                                const counterId = `\\${category}\\${counter}`;
                                return (
                                    <div
                                        key={counterId}
                                        className="flex items-center p-2 hover:bg-gray-50 rounded"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCounters.has(counterId)}
                                            onChange={() => handleCounterToggle(counterId)}
                                            className="mr-2"
                                        />
                                        <span className="flex-1">{counter}</span>
                                        <Tooltip content="View counter details">
                                            <button
                                                onClick={() => window.electron?.performance.showCounterInfo(counterId)}
                                                className="p-1 hover:bg-gray-200 rounded"
                                            >
                                                <FiInfo />
                                            </button>
                                        </Tooltip>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};