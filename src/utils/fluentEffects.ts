// src/utils/fluentEffects.ts
export const fluentEffects = {
    // Efectos de acrilico de Windows
    acrylicEffect: (opacity: number = 0.6) => `
        backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, ${opacity});
    `,

    // Sombras al estilo Windows
    elevationShadow: {
        rest: 'box-shadow: 0 2px 4px rgba(0,0,0,0.1)',
        hover: 'box-shadow: 0 4px 8px rgba(0,0,0,0.2)',
        active: 'box-shadow: 0 1px 2px rgba(0,0,0,0.1)'
    },

    // Transiciones suaves
    transitions: {
        short: 'transition-all duration-200 ease-in-out',
        medium: 'transition-all duration-300 ease-in-out',
        long: 'transition-all duration-500 ease-in-out'
    }
};

// src/components/ui/FluentButton.tsx
import React from 'react';
import { fluentEffects } from '../../utils/fluentEffects';

interface FluentButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    onClick?: () => void;
    disabled?: boolean;
}

export const FluentButton: React.FC<FluentButtonProps> = ({
    children,
    variant = 'primary',
    onClick,
    disabled = false
}) => {
    return (
        <button
            onClick= { onClick }
    disabled = { disabled }
    className = {`
                px-4 py-2 rounded
                ${fluentEffects.transitions.medium}
                ${variant === 'primary'
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                transform hover:scale-105 active:scale-95
            `}
style = {{
                ...fluentEffects.elevationShadow.rest,
        ':hover': fluentEffects.elevationShadow.hover,
            ':active': fluentEffects.elevationShadow.active
}}
        >
    { children }
    </button>
    );
};