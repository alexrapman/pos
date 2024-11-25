// src/__tests__/components/AccessibleTextarea.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AccessibleTextarea } from '../../components/accessibility/AccessibleTextarea';

describe('AccessibleTextarea', () => {
    test('debe renderizarse correctamente con label y textarea', () => {
        const { getByLabelText } = render(
            <AccessibleTextarea id="message" name="message" label="Mensaje" />
        );

        expect(getByLabelText('Mensaje')).toBeInTheDocument();
    });

    test('debe mostrar mensaje de error cuando hay error', () => {
        const { getByText } = render(
            <AccessibleTextarea id="message" name="message" label="Mensaje" error="Error de prueba" />
        );

        expect(getByText('Error de prueba')).toBeInTheDocument();
    });

    test('debe llamar a onChange cuando se cambia el valor', () => {
        const handleChange = jest.fn();
        const { getByLabelText } = render(
            <AccessibleTextarea id="message" name="message" label="Mensaje" onChange={handleChange} />
        );

        fireEvent.change(getByLabelText('Mensaje'), { target: { value: 'Hola' } });
        expect(handleChange).toHaveBeenCalled();
    });
});