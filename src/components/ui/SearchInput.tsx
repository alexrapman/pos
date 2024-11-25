// src/components/ui/SearchInput.tsx
import React from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder = 'Search...'
}) => {
    return (
        <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="
                    pl-10 pr-4 py-2
                    border border-gray-300 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    w-full
                "
            />
        </div>
    );
};