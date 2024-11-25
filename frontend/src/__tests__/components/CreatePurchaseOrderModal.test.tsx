// frontend/src/__tests__/components/CreatePurchaseOrderModal.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CreatePurchaseOrderModal } from '../../components/inventory/CreatePurchaseOrderModal';

describe('CreatePurchaseOrderModal', () => {
  const queryClient = new QueryClient();
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  const renderModal = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <CreatePurchaseOrderModal
          isOpen={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
        />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve([
          { id: 1, name: 'Supplier 1' },
          { id: 2, name: 'Supplier 2' }
        ])
      })
    );
  });

  it('debería renderizar correctamente', () => {
    renderModal();
    expect(screen.getByText('Create Purchase Order')).toBeInTheDocument();
  });

  it('debería permitir agregar items', () => {
    renderModal();
    const addButton = screen.getByText('Add Item');
    fireEvent.click(addButton);
    expect(screen.getAllByRole('spinbutton')).toHaveLength(2);
  });

  it('debería calcular el total correctamente', async () => {
    renderModal();
    const addButton = screen.getByText('Add Item');
    fireEvent.click(addButton);

    const quantityInput = screen.getByRole('spinbutton', { name: /quantity/i });
    const priceInput = screen.getByRole('spinbutton', { name: /price/i });

    fireEvent.change(quantityInput, { target: { value: '2' } });
    fireEvent.change(priceInput, { target: { value: '10' } });

    expect(screen.getByText('Total: $20.00')).toBeInTheDocument();
  });

  it('debería validar formulario antes de enviar', async () => {
    renderModal();
    const submitButton = screen.getByText('Create Order');
    expect(submitButton).toBeDisabled();

    // Seleccionar proveedor
    const supplierSelect = screen.getByRole('combobox', { name: /supplier/i });
    fireEvent.change(supplierSelect, { target: { value: '1' } });

    // Agregar item
    const addButton = screen.getByText('Add Item');
    fireEvent.click(addButton);

    expect(submitButton).not.toBeDisabled();
  });
});