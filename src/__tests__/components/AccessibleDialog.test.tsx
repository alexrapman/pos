// src/__tests__/components/AccessibleDialog.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AccessibleDialog } from '../../components/accessibility/AccessibleDialog';

describe('AccessibleDialog', () => {
    test('debe renderizarse correctamente cuando está abierto', () => {
        const { getByRole, getByText } = render(
            <AccessibleDialog isOpen={true} onClose={() => { }} title="Título del Diálogo">
                Contenido del diálogo
            </AccessibleDialog>
        );

        expect(getByRole('dialog')).toBeInTheDocument();
        expect(getByText('Título del Diálogo')).toBeInTheDocument();
        expect(getByText('Contenido del diálogo')).toBeInTheDocument();
    });

    test('debe no renderizarse cuando está cerrado', () => {
        const { queryByRole } = render(
            <AccessibleDialog isOpen={false} onClose={() => { }} title="Título del Diálogo">
                Contenido del diálogo
            </AccessibleDialog>
        );

        expect(queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('debe cerrar el diálogo al presionar Escape', () => {
        const handleClose = jest.fn();
        const { getByRole } = render(
            <AccessibleDialog isOpen={true} onClose={handleClose} title="Título del Diálogo">
                Contenido del diálogo
            </AccessibleDialog>
        );

        fireEvent.keyDown(getByRole('dialog'), { key: 'Escape' });
        expect(handleClose).toHaveBeenCalled();
    });

    test('debe enfocar el primer elemento al abrirse', () => {
        const { getByText } = render(
            <AccessibleDialog isOpen={true} onClose={() => { }} title="Título del Diálogo">
                <button>Primero</button>
                <button>Segundo</button>
            </AccessibleDialog>
        );

        expect(document.activeElement).toBe(getByText('Primero'));
    });
});

// src/__tests__/components/AccessibleModal.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AccessibleModal } from '../../components/accessibility/AccessibleModal';

describe('AccessibleModal', () => {
    test('debe renderizarse correctamente cuando está abierto', () => {
        const { getByRole, getByText } = render(
            <AccessibleModal isOpen={true} onClose={() => { }} title="Título del Modal">
                Contenido del modal
            </AccessibleModal>
        );

        expect(getByRole('dialog')).toBeInTheDocument();
        expect(getByText('Título del Modal')).toBeInTheDocument();
        expect(getByText('Contenido del modal')).toBeInTheDocument();
    });

    test('debe no renderizarse cuando está cerrado', () => {
        const { queryByRole } = render(
            <AccessibleModal isOpen={false} onClose={() => { }} title="Título del Modal">
                Contenido del modal
            </AccessibleModal>
        );

        expect(queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('debe cerrar el modal al presionar Escape', () => {
        const handleClose = jest.fn();
        const { getByRole } = render(
            <AccessibleModal isOpen={true} onClose={handleClose} title="Título del Modal">
                Contenido del modal
            </AccessibleModal>
        );

        fireEvent.keyDown(getByRole('dialog'), { key: 'Escape' });
        expect(handleClose).toHaveBeenCalled();
    });

    test('debe enfocar el primer elemento al abrirse', () => {
        const { getByText } = render(
            <AccessibleModal isOpen={true} onClose={() => { }} title="Título del Modal">
                <button>Primero</button>
                <button>Segundo</button>
            </AccessibleModal>
        );

        expect(document.activeElement).toBe(getByText('Primero'));
    });
});

// src/__tests__/components/AccessibleTooltip.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AccessibleTooltip } from '../../components/accessibility/AccessibleTooltip';

describe('AccessibleTooltip', () => {
    test('debe mostrar el tooltip al pasar el ratón por encima', () => {
        const { getByText, queryByRole } = render(
            <AccessibleTooltip message="Mensaje del tooltip">
                <button>Hover me</button>
            </AccessibleTooltip>
        );

        fireEvent.mouseEnter(getByText('Hover me'));
        expect(queryByRole('tooltip')).toBeInTheDocument();
        expect(getByText('Mensaje del tooltip')).toBeInTheDocument();
    });

    test('debe ocultar el tooltip al quitar el ratón', () => {
        const { getByText, queryByRole } = render(
            <AccessibleTooltip message="Mensaje del tooltip">
                <button>Hover me</button>
            </AccessibleTooltip>
        );

        fireEvent.mouseEnter(getByText('Hover me'));
        fireEvent.mouseLeave(getByText('Hover me'));
        expect(queryByRole('tooltip')).not.toBeInTheDocument();
    });

    test('debe mostrar el tooltip al enfocar el elemento', () => {
        const { getByText, queryByRole } = render(
            <AccessibleTooltip message="Mensaje del tooltip">
                <button>Focus me</button>
            </AccessibleTooltip>
        );

        fireEvent.focus(getByText('Focus me'));
        expect(queryByRole('tooltip')).toBeInTheDocument();
        expect(getByText('Mensaje del tooltip')).toBeInTheDocument();
    });

    test('debe ocultar el tooltip al desenfocar el elemento', () => {
        const { getByText, queryByRole } = render(
            <AccessibleTooltip message="Mensaje del tooltip">
                <button>Focus me</button>
            </AccessibleTooltip>
        );

        fireEvent.focus(getByText('Focus me'));
        fireEvent.blur(getByText('Focus me'));
        expect(queryByRole('tooltip')).not.toBeInTheDocument();
    });
});