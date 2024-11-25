// src/__tests__/components/AccessibleTabs.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AccessibleTabs } from '../../components/accessibility/AccessibleTabs';

describe('AccessibleTabs', () => {
    const tabs = [
        { id: 'tab1', label: 'Tab 1', content: 'Contenido 1' },
        { id: 'tab2', label: 'Tab 2', content: 'Contenido 2' },
        { id: 'tab3', label: 'Tab 3', content: 'Contenido 3' }
    ];

    test('debe renderizarse correctamente con pestañas y contenido', () => {
        const { getByText } = render(
            <AccessibleTabs tabs={tabs} />
        );

        tabs.forEach(tab => {
            expect(getByText(tab.label)).toBeInTheDocument();
        });

        expect(getByText('Contenido 1')).toBeInTheDocument();
    });

    test('debe cambiar de pestaña al hacer clic', () => {
        const { getByText } = render(
            <AccessibleTabs tabs={tabs} />
        );

        fireEvent.click(getByText('Tab 2'));
        expect(getByText('Contenido 2')).toBeInTheDocument();
    });

    test('debe cambiar de pestaña con las teclas de flecha', () => {
        const { getByText } = render(
            <AccessibleTabs tabs={tabs} />
        );

        const firstTab = getByText('Tab 1');
        firstTab.focus();
        fireEvent.keyDown(firstTab, { key: 'ArrowRight' });
        expect(getByText('Contenido 2')).toBeInTheDocument();

        fireEvent.keyDown(getByText('Tab 2'), { key: 'ArrowLeft' });
        expect(getByText('Contenido 1')).toBeInTheDocument();
    });
});