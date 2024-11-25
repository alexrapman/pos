// src/components/kitchen/CookingInstructions.tsx
import React from 'react';
import { OrderItem } from '../../models/Order';

interface CookingInstructionsProps {
    items: OrderItem[];
}

export const CookingInstructions: React.FC<CookingInstructionsProps> = ({ items }) => {
    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            {items.map((item, index) => (
                <div key={index} className="mb-4">
                    <h4 className="font-bold">{item.name}</h4>
                    <div className="space-y-2">
                        {item.cookingInstructions?.map((instruction, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <span className="text-gray-500">{i + 1}.</span>
                                <span>{instruction}</span>
                            </div>
                        ))}
                        {item.specialRequirements && (
                            <div className="mt-2 text-red-600">
                                Special: {item.specialRequirements}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

// src/components/kitchen/OrderTimer.tsx
import React, { useState, useEffect } from 'react';

interface OrderTimerProps {
    startTime: string;
    targetTime?: number; // in minutes
}

export const OrderTimer: React.FC<OrderTimerProps> = ({
    startTime,
    targetTime = 15
}) => {
    const [elapsed, setElapsed] = useState(0);
    const [isOverdue, setIsOverdue] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const elapsedMinutes = (Date.now() - new Date(startTime).getTime()) / 1000 / 60;
            setElapsed(elapsedMinutes);
            setIsOverdue(elapsedMinutes > targetTime);
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime, targetTime]);

    return (
        <div className={`
            font-mono text-lg
            ${isOverdue ? 'text-red-600 animate-pulse' : 'text-gray-700'}
        `}>
            {Math.floor(elapsed)}:{((elapsed % 1) * 60).toFixed(0).padStart(2, '0')}
        </div>
    );
};