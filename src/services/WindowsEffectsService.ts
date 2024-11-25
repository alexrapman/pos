// src/services/WindowsEffectsService.ts
export class WindowsEffectsService {
    private readonly MICA_BLUR = 20;
    private readonly ACRYLIC_OPACITY = 0.8;

    applyMicaEffect(element: HTMLElement): void {
        element.style.backdropFilter = `blur(${this.MICA_BLUR}px)`;
        element.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    }

    applyAcrylicEffect(element: HTMLElement): void {
        element.style.backdropFilter = 'blur(10px)';
        element.style.backgroundColor = `rgba(255, 255, 255, ${this.ACRYLIC_OPACITY})`;
    }
}

// src/components/ui/WindowsEffects.tsx
import React, { useEffect, useRef } from 'react';
import { WindowsEffectsService } from '../../services/WindowsEffectsService';

interface WindowsEffectsProps {
    children: React.ReactNode;
    effect: 'mica' | 'acrylic';
    className?: string;
}

export const WindowsEffects: React.FC<WindowsEffectsProps> = ({
    children,
    effect,
    className = ''
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const effectsService = new WindowsEffectsService();

    useEffect(() => {
        if (!containerRef.current) return;

        if (effect === 'mica') {
            effectsService.applyMicaEffect(containerRef.current);
        } else {
            effectsService.applyAcrylicEffect(containerRef.current);
        }
    }, [effect]);

    return (
        <div 
            ref= { containerRef }
    className = {`transition-all duration-300 ${className}`
}
        >
    { children }
    </div>
    );
};