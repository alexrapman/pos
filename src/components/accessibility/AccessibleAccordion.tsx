// src/components/accessibility/AccessibleAccordion.tsx
import React, { useState } from 'react';

interface AccordionItem {
    id: string;
    title: string;
    content: React.ReactNode;
}

interface AccessibleAccordionProps {
    items: AccordionItem[];
}

export const AccessibleAccordion: React.FC<AccessibleAccordionProps> = ({
    items
}) => {
    const [openItem, setOpenItem] = useState<string | null>(null);

    const toggleItem = (id: string) => {
        setOpenItem(prev => (prev === id ? null : id));
    };

    return (
        <div>
            {items.map(item => (
                <div key={item.id} className="border-b">
                    <button
                        id={`accordion-header-${item.id}`}
                        aria-expanded={openItem === item.id}
                        aria-controls={`accordion-panel-${item.id}`}
                        onClick={() => toggleItem(item.id)}
                        className="w-full text-left px-4 py-2 focus:outline-none focus:ring"
                    >
                        {item.title}
                    </button>
                    <div
                        id={`accordion-panel-${item.id}`}
                        role="region"
                        aria-labelledby={`accordion-header-${item.id}`}
                        hidden={openItem !== item.id}
                        className="px-4 py-2"
                    >
                        {item.content}
                    </div>
                </div>
            ))}
        </div>
    );
};