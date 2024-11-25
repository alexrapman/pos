// src/components/accessibility/AudioFeedback.tsx
import React from 'react';

const sounds = {
    notification: new Audio('/sounds/notification.wav'),
    warning: new Audio('/sounds/warning.wav'),
    error: new Audio('/sounds/error.wav'),
    success: new Audio('/sounds/success.wav')
};

export const AudioFeedback: React.FC<{
    type: keyof typeof sounds;
    play: boolean;
}> = ({ type, play }) => {
    React.useEffect(() => {
        if (play) {
            sounds[type].play().catch(() => { });
        }
    }, [type, play]);

    return null;
};