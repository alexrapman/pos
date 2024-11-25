// src/__tests__/components/FocusManager.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { FocusManager } from '../../components/accessibility/FocusManager';

describe('FocusManager', () => {
    test('debe enfocar el primer elemento al activarse', () => {
        const { getByText } = render(
            <FocusManager>
                <button>Primero</button>
                <button>Segundo</button>
            </FocusManager>
        );

        const firstButton = getByText('Primero');
        expect(document.activeElement).toBe(firstButton);
    });

    test('debe restaurar el foco al desactivarse', () => {
        const { getByText, rerender } = render(
            <>
                <button>Anterior</button>
                <FocusManager>
                    <button>Primero</button>
                    <button>Segundo</button>
                </FocusManager>
            </>
        );

        const previousButton = getByText('Anterior');
        previousButton.focus();
        expect(document.activeElement).toBe(previousButton);

        rerender(
            <>
                <button>Anterior</button>
                <FocusManager active={false}>
                    <button>Primero</button>
                    <button>Segundo</button>
                </FocusManager>
            </>
        );

        expect(document.activeElement).toBe(previousButton);
    });

    test('debe manejar trampas de foco correctamente', () => {
        const { getByText } = render(
            <FocusManager>
                <button>Primero</button>
                <button>Segundo</button>
                <button>Tercero</button>
            </FocusManager>
        );

        const firstButton = getByText('Primero');
        const secondButton = getByText('Segundo');
        const thirdButton = getByText('Tercero');

        firstButton.focus();
        fireEvent.keyDown(firstButton, { key: 'Tab' });
        expect(document.activeElement).toBe(secondButton);

        fireEvent.keyDown(secondButton, { key: 'Tab' });
        expect(document.activeElement).toBe(thirdButton);

        fireEvent.keyDown(thirdButton, { key: 'Tab' });
        expect(document.activeElement).toBe(firstButton);

        fireEvent.keyDown(firstButton, { key: 'Tab', shiftKey: true });
        expect(document.activeElement).toBe(thirdButton);
    });

    test('debe no enfocar automáticamente si autoFocus es false', () => {
        const { getByText } = render(
            <FocusManager autoFocus={false}>
                <button>Primero</button>
                <button>Segundo</button>
            </FocusManager>
        );

        const firstButton = getByText('Primero');
        expect(document.activeElement).not.toBe(firstButton);
    });
});