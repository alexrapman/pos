// frontend/src/__tests__/pages/payment/success.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import PaymentSuccess from '../../../pages/payment/success';

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

describe('PaymentSuccess', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      query: { orderId: '123' },
      push: jest.fn()
    }));

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        blob: () => new Blob(),
        ok: true
      })
    );
    global.URL.createObjectURL = jest.fn();
  });

  it('debería mostrar el número de orden', () => {
    render(<PaymentSuccess />);
    expect(screen.getByText(/order #123/i)).toBeInTheDocument();
  });

  it('debería intentar cargar el recibo', async () => {
    render(<PaymentSuccess />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/payment/receipt/123',
        expect.any(Object)
      );
    });
  });
});