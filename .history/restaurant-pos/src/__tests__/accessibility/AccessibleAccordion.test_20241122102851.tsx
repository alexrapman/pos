// src/__tests__/components/AccessibleAccordion.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AccessibleAccordion } from '../../components/accessibility/AccessibleAccordion';

describe('AccessibleAccordion', () => {
    const items = [
        { id: 'item1', title: 'Item 1', content: 'Contenido 1' },
        { id: 'item2', title: 'Item 2', content: 'Contenido 2' },
        { id: 'item3', title: 'Item 3', content: 'Contenido 3' }
    ];

    test('debe renderizarse correctamente con elementos y contenido', () => {
        const { getByText } = render(
            <AccessibleAccordion items={items} />
        );

        items.forEach(item => {
            expect(getByText(item.title)).toBeInTheDocument();
        });
    });

    test('debe mostrar y ocultar contenido al hacer clic', () => {
        const { getByText, queryByText } = render(
            <AccessibleAccordion items={items} />
        );

        fireEvent.click(getByText('Item 1'));
        expect(getByText('Contenido 1')).toBeInTheDocument();

        fireEvent.click(getByText('Item 1'));
        expect(queryByText('Contenido 1')).not.toBeInTheDocument();
    });

    test('debe manejar múltiples elementos abiertos', () => {
        const { getByText } = render(
            <AccessibleAccordion items={items} />
        );

        fireEvent.click(getByText('Item 1'));
        fireEvent.click(getByText('Item 2'));

        expect(getByText('Contenido 1')).toBeInTheDocument();
        expect(getByText('Contenido 2')).toBeInTheDocument();
    });
});