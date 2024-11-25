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

