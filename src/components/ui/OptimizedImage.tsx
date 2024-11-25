// src/components/ui/OptimizedImage.tsx
import React, { useState, useEffect } from 'react';
import { useDpiAware } from '../../utils/dpiUtils';
import { WindowsImageOptimizer } from '../../services/WindowsImageOptimizer';

interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false
}) => {
    const [optimizedSrc, setOptimizedSrc] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const dpiScale = useDpiAware();
    const imageOptimizer = new WindowsImageOptimizer();

    useEffect(() => {
        let mounted = true;

        const loadImage = async () => {
            try {
                setLoading(true);
                const optimizedPath = await imageOptimizer.optimizeImage(src, dpiScale);

                if (mounted) {
                    setOptimizedSrc(optimizedPath);
                    setLoading(false);
                }
            } catch (err) {
                if (mounted) {
                    setError(err as Error);
                    setLoading(false);
                }
            }
        };

        if (priority) {
            loadImage();
        } else {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        loadImage();
                        observer.disconnect();
                    }
                },
                { rootMargin: '50px' }
            );

            const img = document.createElement('img');
            observer.observe(img);
        }

        return () => {
            mounted = false;
        };
    }, [src, dpiScale, priority]);

    if (error) {
        return <div className="text-red-500">Failed to load image: {error.message}</div>;
    }

    return (
        <div className={`relative ${className}`}>
            {loading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            {optimizedSrc && (
                <img
                    src={optimizedSrc}
                    alt={alt}
                    width={width}
                    height={height}
                    className={`w-full h-full object-cover ${loading ? 'opacity-0' : 'opacity-100'}`}
                    style={{ transition: 'opacity 0.2s ease-in-out' }}
                />
            )}
        </div>
    );
};