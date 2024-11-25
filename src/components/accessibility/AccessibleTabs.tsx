// src/components/accessibility/AccessibleTabs.tsx
import React, { useState, useRef, useEffect } from 'react';

interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
}

interface AccessibleTabsProps {
    tabs: Tab[];
    initialTab?: string;
}

export const AccessibleTabs: React.FC<AccessibleTabsProps> = ({
    tabs,
    initialTab
}) => {
    const [activeTab, setActiveTab] = useState(initialTab || tabs[0].id);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
            if (currentIndex === -1) return;

            switch (e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % tabs.length;
                    setActiveTab(tabs[nextIndex].id);
                    tabRefs.current[nextIndex]?.focus();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                    setActiveTab(tabs[prevIndex].id);
                    tabRefs.current[prevIndex]?.focus();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeTab, tabs]);

    return (
        <div>
            <div role="tablist" aria-label="Tabs" className="flex space-x-4">
                {tabs.map((tab, index) => (
                    <button
                        key={tab.id}
                        ref={el => tabRefs.current[index] = el}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`panel-${tab.id}`}
                        id={`tab-${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            px-4 py-2 rounded-t-lg
                            ${activeTab === tab.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700'}
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            {tabs.map(tab => (
                <div
                    key={tab.id}
                    role="tabpanel"
                    id={`panel-${tab.id}`}
                    aria-labelledby={`tab-${tab.id}`}
                    hidden={activeTab !== tab.id}
                    className="p-4 border-t border-gray-200"
                >
                    {tab.content}
                </div>
            ))}
        </div>
    );
};