// src/components/accessibility/KeyboardNavigation.tsx
import React, { useEffect } from 'react';

export const KeyboardNavigation: React.FC = () => {
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Alt + N: Nueva notificación
            if (e.altKey && e.key === 'n') {
                window.electron.showNotificationDialog();
            }
            // Alt + C: Cerrar todas las notificaciones
            if (e.altKey && e.key === 'c') {
                window.electron.clearAllNotifications();
            }
            // Alt + M: Marcar todas como leídas
            if (e.altKey && e.key === 'm') {
                window.electron.markAllAsRead();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    return null;
};

import React, { useEffect, useRef } from 'react';

interface MenuItem {
    id: string;
    label: string;
    shortcut?: string;
    action: () => void;
}

interface KeyboardNavigationMenuProps {
    items: MenuItem[];
    ariaLabel: string;
}

export const KeyboardNavigationMenu: React.FC<KeyboardNavigationMenuProps> = ({
    items,
    ariaLabel
}) => {
    const menuRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const handleKeyNavigation = (e: KeyboardEvent) => {
            const currentElement = document.activeElement;
            const menuItems = menuRef.current?.querySelectorAll('li');

            if (!menuItems) return;

            const currentIndex = Array.from(menuItems).indexOf(currentElement as Element);

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % menuItems.length;
                    (menuItems[nextIndex] as HTMLElement).focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex - 1 < 0 ? menuItems.length - 1 : currentIndex - 1;
                    (menuItems[prevIndex] as HTMLElement).focus();
                    break;
            }
        };

        const menu = menuRef.current;
        menu?.addEventListener('keydown', handleKeyNavigation);
        return () => menu?.removeEventListener('keydown', handleKeyNavigation);
    }, []);

    return (
        <nav>
            <ul
                ref={menuRef}
                role="menu"
                aria-label={ariaLabel}
                className="space-y-2"
            >
                {items.map((item) => (
                    <li
                        key={item.id}
                        role="menuitem"
                        tabIndex={0}
                        onClick={item.action}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                item.action();
                            }
                        }}
                        className="p-2 border rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <div className="flex justify-between items-center">
                            <span>{item.label}</span>
                            {item.shortcut && (
                                <span className="text-sm text-gray-500" aria-label={`Atajo: ${item.shortcut}`}>
                                    {item.shortcut}
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </nav>
    );
};