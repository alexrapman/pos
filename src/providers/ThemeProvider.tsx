// src/providers/ThemeProvider.tsx
import React, { createContext, useEffect, useState } from 'react';
import { Registry } from 'winreg';

interface ThemeContextType {
    isDark: boolean;
    isHighContrast: boolean;
    colors: ColorScheme;
    toggleTheme: () => void;
    setHighContrast: (enabled: boolean) => void;
}

interface ColorScheme {
    primary: string;
    background: string;
    surface: string;
    text: string;
    border: string;
}

const defaultColors: Record<'light' | 'dark' | 'highContrast', ColorScheme> = {
    light: {
        primary: '#3B82F6',
        background: '#FFFFFF',
        surface: '#F3F4F6',
        text: '#1F2937',
        border: '#E5E7EB'
    },
    dark: {
        primary: '#60A5FA',
        background: '#1F2937',
        surface: '#374151',
        text: '#F9FAFB',
        border: '#4B5563'
    },
    highContrast: {
        primary: '#FFFFFF',
        background: '#000000',
        surface: '#000000',
        text: '#FFFFFF',
        border: '#FFFFFF'
    }
};

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDark, setIsDark] = useState(false);
    const [isHighContrast, setIsHighContrast] = useState(false);

    useEffect(() => {
        checkWindowsTheme();
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', checkWindowsTheme);
        return () => mediaQuery.removeEventListener('change', checkWindowsTheme);
    }, []);

    const checkWindowsTheme = async () => {
        const reg = new Registry({
            hive: Registry.HKCU,
            key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize'
        });

        reg.get('AppsUseLightTheme', (err, item) => {
            if (!err && item) {
                setIsDark(item.value === 0);
            }
        });

        reg.get('HighContrast', (err, item) => {
            if (!err && item) {
                setIsHighContrast(item.value === 1);
            }
        });
    };

    const currentColors = isHighContrast
        ? defaultColors.highContrast
        : isDark
            ? defaultColors.dark
            : defaultColors.light;

    return (
        <ThemeContext.Provider value={{
            isDark,
            isHighContrast,
            colors: currentColors,
            toggleTheme: () => setIsDark(!isDark),
            setHighContrast: (enabled) => setIsHighContrast(enabled)
        }}>
            <div className={`
                ${isDark ? 'dark' : ''}
                ${isHighContrast ? 'high-contrast' : ''}
            `}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};