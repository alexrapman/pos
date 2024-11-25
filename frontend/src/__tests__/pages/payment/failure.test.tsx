/ frontend/src/__tests__/pages/payment/failure.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import PaymentFailure from '../../../pages/payment/failure';

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

describe('PaymentFailure', () => {
  const mockRouter = {
    query: { error: 'Test error message' },
    back: jest.fn()
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => mockRouter);
  });

  it('debería mostrar el mensaje de error', () => {
    render(<PaymentFailure />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('debería permitir reintentar el pago', () => {
    render(<PaymentFailure />);
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);
    expect(mockRouter.back).toHaveBeenCalled();
  });
});