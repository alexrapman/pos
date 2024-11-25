// src/components/ui/ImagePreloader.tsx
import React, { useEffect, useState } from 'react';
import { WindowsImageOptimizer } from '../../services/WindowsImageOptimizer';

interface ImagePreloaderProps {
    src: string;
    alt: string;
    className?: string;
    onLoad?: () => void;
    onError?: (error: Error) => void;
}

export const ImagePreloader: React.FC<ImagePreloaderProps> = ({
    src,
    alt,
    className = '',
    onLoad,
    onError
}) => {
    const [optimizedSrc, setOptimizedSrc] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const imageOptimizer = new WindowsImageOptimizer();

    useEffect(() => {
        let mounted = true;

        const loadImage = async () => {
            try {
                setLoading(true);
                const optimizedPath = await imageOptimizer.optimizeImage(src, window.devicePixelRatio);

                if (mounted) {
                    setOptimizedSrc(optimizedPath);
                    setLoading(false);
                    onLoad?.();
                }
            } catch (err) {
                if (mounted) {
                    setError(err as Error);
                    setLoading(false);
                    onError?.(err as Error);
                }
            }
        };

        loadImage();

        return () => {
            mounted = false;
        };
    }, [src, onLoad, onError]);

    if (error) {
        return <div className="text-red-500">Error al cargar la imagen: {error.message}</div>;
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
                    className={`w-full h-full object-cover ${loading ? 'opacity-0' : 'opacity-100'}`}
                    style={{ transition: 'opacity 0.2s ease-in-out' }}
                />
            )}
        </div>
    );
};