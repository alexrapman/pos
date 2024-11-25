// src/__tests__/components/AccessibleTable.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { AccessibleTable } from '../../components/accessibility/AccessibleTable';

describe('AccessibleTable', () => {
    const headers = ['Nombre', 'Edad', 'Ciudad'];
    const data = [
        ['Juan', 30, 'Madrid'],
        ['Ana', 25, 'Barcelona'],
        ['Luis', 35, 'Valencia']
    ];

    test('debe renderizarse correctamente con encabezados y datos', () => {
        const { getByText } = render(
            <AccessibleTable headers={headers} data={data} />
        );

        headers.forEach(header => {
            expect(getByText(header)).toBeInTheDocument();
        });

        data.forEach(row => {
            row.forEach(cell => {
                expect(getByText(cell.toString())).toBeInTheDocument();
            });
        });
    });

    test('debe incluir un caption si se proporciona', () => {
        const { getByText } = render(
            <AccessibleTable headers={headers} data={data} caption="Tabla de ejemplo" />
        );

        expect(getByText('Tabla de ejemplo')).toBeInTheDocument();
    });
});

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