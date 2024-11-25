// src/components/accessibility/LiveRegion.tsx
import React, { useEffect, useState } from 'react';

interface LiveRegionProps {
    priority?: 'polite' | 'assertive';
}

export const LiveRegion: React.FC<LiveRegionProps> = ({ priority = 'polite' }) => {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const handler = (event: CustomEvent) => {
            setMessages(prev => [...prev, event.detail]);
            setTimeout(() => {
                setMessages(prev => prev.slice(1));
            }, 5000);
        };

        window.addEventListener('announcement', handler as EventListener);
        return () => window.removeEventListener('announcement', handler as EventListener);
    }, []);

    return (
        <div
            aria-live={priority}
            aria-atomic="true"
            className="sr-only"
        >
            {messages.map((msg, index) => (
                <p key={index}>{msg}</p>
            ))}
        </div>
    );
};
