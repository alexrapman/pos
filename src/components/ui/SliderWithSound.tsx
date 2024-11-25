// src/components/ui/SliderWithSound.tsx
import React, { useState, useCallback } from 'react';
import { WindowsSoundPlayer } from '../../utils/windowsSounds';

interface SliderWithSoundProps extends SliderProps {
    soundEnabled?: boolean;
    volume?: number;
}

export const SliderWithSound: FC<SliderWithSoundProps> = ({
    value,
    onChange,
    soundEnabled = true,
    volume = 1.0,
    ...props
}) => {
    const [lastSnap, setLastSnap] = useState<number | null>(null);

    const handleChange = useCallback((newValue: number[]) => {
        const nearestSnap = findNearestSnapPoint(newValue[0]);

        if (soundEnabled && lastSnap !== nearestSnap) {
            if (Math.abs(newValue[0] - nearestSnap) < 0.01) {
                WindowsSoundPlayer.playSystemSound('snap');
                setLastSnap(nearestSnap);
            }
        }

        onChange(newValue);
    }, [onChange, soundEnabled, lastSnap]);

    return (
        <div className="space-y-4">
            <Slider
                value={value}
                onChange={handleChange}
                {...props}
            />
            {soundEnabled && (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => WindowsSoundPlayer.playSystemSound('select')}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        Test Sound
                    </button>
                </div>
            )}
        </div>
    );
};