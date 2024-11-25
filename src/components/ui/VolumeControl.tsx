// src/components/ui/VolumeControl.tsx
import React, { useState, useEffect } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';

interface VolumeControlProps {
    initialVolume?: number;
    onChange?: (volume: number, muted: boolean) => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
    initialVolume = 1.0,
    onChange
}) => {
    const [volume, setVolume] = useState(initialVolume);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        // Load saved preferences
        const savedVolume = localStorage.getItem('sliderVolume');
        const savedMuted = localStorage.getItem('sliderMuted');

        if (savedVolume) setVolume(parseFloat(savedVolume));
        if (savedMuted) setMuted(savedMuted === 'true');
    }, []);

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        localStorage.setItem('sliderVolume', newVolume.toString());
        onChange?.(newVolume, muted);
    };

    const toggleMute = () => {
        setMuted(!muted);
        localStorage.setItem('sliderMuted', (!muted).toString());
        onChange?.(volume, !muted);
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={toggleMute}
                className="p-1 rounded hover:bg-gray-100"
            >
                {muted ? <FiVolumeX /> : <FiVolume2 />}
            </button>
            <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-24"
            />
        </div>
    );
};