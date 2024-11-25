// frontend/src/__tests__/components/OrderList.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { OrderList } from '../../components/kitchen/OrderList';
import { useKitchenSocket } from '../../hooks/useSocket';

jest.mock('../../hooks/useSocket');

describe('OrderList Component', () => {
  const mockOrders = [
    {
      id: 1,
      tableNumber: 5,
      status: 'pending',
      items: [{ name: 'Pizza', quantity: 2 }]
    }
  ];

  beforeEach(() => {
    (useKitchenSocket as jest.Mock).mockImplementation((callback) => {
      callback(mockOrders[0]);
    });
  });

  it('renders orders correctly', () => {
    render(<OrderList />);
    
    expect(screen.getByText('Table 5')).toBeInTheDocument();
    expect(screen.getByText('2x Pizza')).toBeInTheDocument();
  });

  it('updates order status', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 'preparing' })
    });

    render(<OrderList />);
    
    const startButton = screen.getByText('Start Preparing');
    await act(async () => {
      fireEvent.click(startButton);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/orders/1/status',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ status: 'preparing' })
      })
    );
  });

  it('handles new orders in real-time', () => {
    let socketCallback: (order: any) => void;
    (useKitchenSocket as jest.Mock).mockImplementation((callback) => {
      socketCallback = callback;
    });

    render(<OrderList />);

    act(() => {
      socketCallback({
        id: 2,
        tableNumber: 3,
        status: 'pending',
        items: [{ name: 'Burger', quantity: 1 }]
      });
    });

    expect(screen.getByText('Table 3')).toBeInTheDocument();
    expect(screen.getByText('1x Burger')).toBeInTheDocument();
  });
});