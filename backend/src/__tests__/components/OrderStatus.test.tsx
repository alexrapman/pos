// frontend/src/__tests__/components/OrderStatus.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { OrderStatus } from '../../components/waiter/OrderStatus';
import { useOrderSocket } from '../../hooks/useSocket';
import { toast } from 'react-toastify';

jest.mock('../../hooks/useSocket');
jest.mock('react-toastify');

describe('OrderStatus Component', () => {
  const mockProps = {
    orderId: 1,
    initialStatus: 'pending',
    tableNumber: 5
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial status correctly', () => {
    render(<OrderStatus {...mockProps} />);
    
    expect(screen.getByText('Table 5')).toBeInTheDocument();
    expect(screen.getByText('Order #1')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  it('updates status when socket event received', () => {
    let socketCallback: (data: any) => void;
    (useOrderSocket as jest.Mock).mockImplementation((orderId, callback) => {
      socketCallback = callback;
    });

    render(<OrderStatus {...mockProps} />);

    act(() => {
      socketCallback({ status: 'preparing' });
    });

    expect(screen.getByText('preparing')).toBeInTheDocument();
    expect(toast.info).toHaveBeenCalledWith(
      'Order 1 status updated to preparing'
    );
  });

  it('shows deliver button when order is ready', () => {
    render(<OrderStatus {...mockProps} initialStatus="ready" />);
    
    expect(screen.getByText('Mark as Delivered')).toBeInTheDocument();
  });

  it('handles deliver action', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 'delivered' })
    });

    render(<OrderStatus {...mockProps} initialStatus="ready" />);
    
    const deliverButton = screen.getByText('Mark as Delivered');
    await act(async () => {
      fireEvent.click(deliverButton);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/orders/1/status',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ status: 'delivered' })
      })
    );
  });

  it('applies correct status color', () => {
    const { rerender } = render(<OrderStatus {...mockProps} />);
    
    expect(screen.getByText('pending')).toHaveClass('bg-yellow-100');

    rerender(<OrderStatus {...mockProps} initialStatus="preparing" />);
    expect(screen.getByText('preparing')).toHaveClass('bg-blue-100');

    rerender(<OrderStatus {...mockProps} initialStatus="ready" />);
    expect(screen.getByText('ready')).toHaveClass('bg-green-100');
  });
});