// src/components/ui/SkeletonLoader.tsx
import React from 'react';

interface SkeletonLoaderProps {
    count?: number;
    height?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    count = 1,
    height = 'h-4'
}) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className={`
                        ${height} bg-gray-200 rounded
                        animate-pulse mb-2
                    `}
                />
            ))}
        </>
    );
};