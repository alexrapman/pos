// src/components/accessibility/HighContrastProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const HighContrastContext = createContext({
    highContrast: false,
    toggleHighContrast: () => { }
});

export const HighContrastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [highContrast, setHighContrast] = useState(false);

    useEffect(() => {
        // Detectar configuración de Windows
        const mediaQuery = window.matchMedia('(-ms-high-contrast: active)');
        setHighContrast(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setHighContrast(e.matches);
        mediaQuery.addListener(handler);
        return () => mediaQuery.removeListener(handler);
    }, []);

    return (
        <HighContrastContext.Provider value={{
            highContrast,
            toggleHighContrast: () => setHighContrast(prev => !prev)
        }}>
            <div className={highContrast ? 'high-contrast-theme' : ''}>
                {children}
            </div>
        </HighContrastContext.Provider>
    );
};