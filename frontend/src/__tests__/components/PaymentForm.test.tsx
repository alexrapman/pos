// frontend/src/__tests__/components/PaymentForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentForm } from '../../components/payment/PaymentForm';
import { Elements } from '@stripe/react-stripe-js';

// Mock Stripe
jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: any) => children,
  useStripe: () => ({
    confirmCardPayment: jest.fn().mockResolvedValue({ paymentIntent: { id: 'pi_123' } })
  }),
  useElements: () => ({
    getElement: jest.fn()
  }),
  CardElement: () => null
}));

describe('PaymentForm', () => {
  const mockProps = {
    orderId: 1,
    amount: 100
  };

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ clientSecret: 'test_secret' })
    });
  });

  it('debería mostrar el monto correcto', () => {
    render(<PaymentForm {...mockProps} />);
    expect(screen.getByText('Amount to pay: €100.00')).toBeInTheDocument();
  });

  it('debería procesar el pago al enviar', async () => {
    render(<PaymentForm {...mockProps} />);
    
    const submitButton = screen.getByText('Pay Now');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/payment/process',
        expect.any(Object)
      );
    });
  });

  it('debería mostrar error si el pago falla', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Payment failed'));
    
    render(<PaymentForm {...mockProps} />);
    
    const submitButton = screen.getByText('Pay Now');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Payment failed. Please try again.')).toBeInTheDocument();
    });
  });
});