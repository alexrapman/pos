// src/hooks/useTheme.ts
import { useState, useEffect } from 'react';
import { Registry } from 'winreg';

interface ThemeSettings {
    highContrast: boolean;
    darkMode: boolean;
    colors: {
        primary: string;
        background: string;
        text: string;
        grid: string;
    };
}

export const useTheme = () => {
    const [theme, setTheme] = useState<ThemeSettings>({
        highContrast: false,
        darkMode: false,
        colors: {
            primary: '#3B82F6',
            background: '#FFFFFF',
            text: '#000000',
            grid: '#E5E7EB'
        }
    });

    useEffect(() => {
        checkWindowsSettings();
        const savedTheme = localStorage.getItem('theme-settings');
        if (savedTheme) {
            setTheme(JSON.parse(savedTheme));
        }
    }, []);

    const checkWindowsSettings = async () => {
        try {
            const reg = new Registry({
                hive: Registry.HKCU,
                key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize'
            });

            reg.get('AppsUseLightTheme', (err, item) => {
                if (!err && item) {
                    const darkMode = item.value === 0;
                    updateTheme({ darkMode });
                }
            });

            reg.get('EnableTransparency', (err, item) => {
                if (!err && item) {
                    const highContrast = item.value === 0;
                    updateTheme({ highContrast });
                }
            });
        } catch (error) {
            console.error('Failed to read Windows settings:', error);
        }
    };

    const updateTheme = (settings: Partial<ThemeSettings>) => {
        const newTheme = { ...theme, ...settings };
        setTheme(newTheme);
        localStorage.setItem('theme-settings', JSON.stringify(newTheme));
    };

    return {
        ...theme,
        updateTheme
    };
};