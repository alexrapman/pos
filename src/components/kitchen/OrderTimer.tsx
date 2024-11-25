// src/components/kitchen/OrderTimer.tsx
import React, { useState, useEffect } from 'react';
import { differenceInMinutes, differenceInSeconds } from 'date-fns';

interface OrderTimerProps {
    startTime: Date;
    targetMinutes?: number;
    onPriorityChange?: (isPriority: boolean) => void;
}

export const OrderTimer: React.FC<OrderTimerProps> = ({
    startTime,
    targetMinutes = 15,
    onPriorityChange
}) => {
    const [timeElapsed, setTimeElapsed] = useState({ minutes: 0, seconds: 0 });
    const [isPriority, setIsPriority] = useState(false);
    const [audio] = useState(new Audio('/sounds/priority-alert.mp3'));

    useEffect(() => {
        const interval = setInterval(() => {
            const minutes = differenceInMinutes(new Date(), startTime);
            const seconds = differenceInSeconds(new Date(), startTime) % 60;

            setTimeElapsed({ minutes, seconds });

            const newIsPriority = minutes >= targetMinutes;
            if (newIsPriority !== isPriority) {
                setIsPriority(newIsPriority);
                onPriorityChange?.(newIsPriority);
                if (newIsPriority) {
                    audio.play().catch(console.error);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime, targetMinutes, isPriority, audio, onPriorityChange]);

    return (
        <div className={`
            font-mono text-lg
            ${isPriority ? 'text-red-600 animate-pulse' : 'text-gray-700'}
        `}>
            {String(timeElapsed.minutes).padStart(2, '0')}:
            {String(timeElapsed.seconds).padStart(2, '0')}
        </div>
    );
};