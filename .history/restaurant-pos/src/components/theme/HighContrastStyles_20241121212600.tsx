// src/components/theme/HighContrastStyles.tsx
import React from 'react';
import { highContrastStyles } from '../../styles/highContrast';

export const HighContrastStyles: React.FC = () => {
    return (
        <style jsx global>{`
            .high-contrast-theme {
                --background: ${highContrastStyles.light.background};
                --text: ${highContrastStyles.light.text};
                --border: ${highContrastStyles.light.border};
                --accent: ${highContrastStyles.light.accent};
            }

            @media (prefers-color-scheme: dark) {
                .high-contrast-theme {
                    --background: ${highContrastStyles.dark.background};
                    --text: ${highContrastStyles.dark.text};
                    --border: ${highContrastStyles.dark.border};
                    --accent: ${highContrastStyles.dark.accent};
                }
            }

            .high-contrast-theme .notification {
                background-color: var(--background);
                color: var(--text);
                border: 2px solid var(--border);
                box-shadow: none;
            }

            .high-contrast-theme .notification-success {
                border-color: ${highContrastStyles.light.success};
            }

            .high-contrast-theme .notification-error {
                border-color: ${highContrastStyles.light.error};
            }

            .high-contrast-theme .notification-warning {
                border-color: ${highContrastStyles.light.warning};
            }

            .high-contrast-theme button {
                background-color: var(--background);
                color: var(--text);
                border: 2px solid var(--border);
                outline: 2px solid transparent;
            }

            .high-contrast-theme button:focus {
                outline: 2px solid var(--accent);
            }

            @media screen and (forced-colors: active) {
                .notification {
                    forced-color-adjust: none;
                }
            }
        `}</style>
    );
};