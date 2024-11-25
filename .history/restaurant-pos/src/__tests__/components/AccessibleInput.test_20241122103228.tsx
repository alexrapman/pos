// src/__tests__/components/AccessibleInput.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AccessibleInput } from '../../components/accessibility/AccessibleInput';

describe('AccessibleInput', () => {
    test('debe renderizarse correctamente con label e input', () => {
        const { getByLabelText } = render(
            <AccessibleInput id="name" name="name" label="Nombre" />
        );

        expect(getByLabelText('Nombre')).toBeInTheDocument();
    });

    test('debe mostrar mensaje de error cuando hay error', () => {
        const { getByText } = render(
            <AccessibleInput id="name" name="name" label="Nombre" error="Error de prueba" />
        );

        expect(getByText('Error de prueba')).toBeInTheDocument();
    });

    test('debe llamar a onChange cuando se cambia el valor', () => {
        const handleChange = jest.fn();
        const { getByLabelText } = render(
            <AccessibleInput id="name" name="name" label="Nombre" onChange={handleChange} />
        );

        fireEvent.change(getByLabelText('Nombre'), { target: { value: 'Juan' } });
        expect(handleChange).toHaveBeenCalled();
    });
});
