// src/__tests__/components/AccessibleForm.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AccessibleForm } from '../../components/accessibility/AccessibleForm';
import { AccessibleInput } from '../../components/accessibility/AccessibleInput';
import { AccessibleTextarea } from '../../components/accessibility/AccessibleTextarea';

describe('AccessibleForm', () => {
    const handleSubmit = jest.fn();

    test('debe renderizarse correctamente con inputs y textarea', () => {
        const { getByLabelText } = render(
            <AccessibleForm onSubmit={handleSubmit}>
                <AccessibleInput id="name" name="name" label="Nombre" />
                <AccessibleInput id="email" name="email" label="Correo Electrónico" />
                <AccessibleTextarea id="message" name="message" label="Mensaje" />
            </AccessibleForm>
        );

        expect(getByLabelText('Nombre')).toBeInTheDocument();
        expect(getByLabelText('Correo Electrónico')).toBeInTheDocument();
        expect(getByLabelText('Mensaje')).toBeInTheDocument();
    });

    test('debe mostrar errores de validación', () => {
        const { getByText, getByLabelText } = render(
            <AccessibleForm onSubmit={handleSubmit}>
                <AccessibleInput id="name" name="name" label="Nombre" />
                <AccessibleInput id="email" name="email" label="Correo Electrónico" />
                <AccessibleTextarea id="message" name="message" label="Mensaje" />
            </AccessibleForm>
        );

        fireEvent.change(getByLabelText('Correo Electrónico'), { target: { value: 'invalid-email' } });
        fireEvent.submit(getByText('Enviar'));

        expect(getByText('El nombre es obligatorio')).toBeInTheDocument();
        expect(getByText('El correo electrónico no es válido')).toBeInTheDocument();
    });

    test('debe llamar a onSubmit con datos válidos', () => {
        const { getByText, getByLabelText } = render(
            <AccessibleForm onSubmit={handleSubmit}>
                <AccessibleInput id="name" name="name" label="Nombre" />
                <AccessibleInput id="email" name="email" label="Correo Electrónico" />
                <AccessibleTextarea id="message" name="message" label="Mensaje" />
            </AccessibleForm>
        );

        fireEvent.change(getByLabelText('Nombre'), { target: { value: 'Juan' } });
        fireEvent.change(getByLabelText('Correo Electrónico'), { target: { value: 'juan@example.com' } });
        fireEvent.change(getByLabelText('Mensaje'), { target: { value: 'Hola' } });
        fireEvent.submit(getByText('Enviar'));

        expect(handleSubmit).toHaveBeenCalledWith({
            name: 'Juan',
            email: 'juan@example.com',
            message: 'Hola'
        });
    });
});