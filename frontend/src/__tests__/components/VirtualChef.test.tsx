// frontend/src/__tests__/components/VirtualChef.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { VirtualChef } from '../../components/chef/VirtualChef';
import { toast } from 'react-toastify';

jest.mock('react-toastify');

describe('VirtualChef Component', () => {
  const queryClient = new QueryClient();
  const mockRecipe = {
    id: 1,
    name: 'Test Recipe',
    ingredients: ['ingredient1', 'ingredient2'],
    instructions: ['step1', 'step2'],
    preparationTime: 30,
    difficulty: 'medium',
    tips: ['tip1', 'tip2']
  };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <VirtualChef />
      </QueryClientProvider>
    );
  };

  it('should add ingredients when pressing enter', () => {
    renderComponent();
    
    const input = screen.getByPlaceholderText('Add ingredient');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', target: { value: 'tomato' } });
    
    expect(screen.getByText('tomato')).toBeInTheDocument();
  });

  it('should remove ingredients when clicking remove button', () => {
    renderComponent();
    
    const input = screen.getByPlaceholderText('Add ingredient');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', target: { value: 'tomato' } });
    
    const removeButton = screen.getByText('×');
    fireEvent.click(removeButton);
    
    expect(screen.queryByText('tomato')).not.toBeInTheDocument();
  });

  it('should fetch recipe recommendation', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRecipe)
    });

    renderComponent();
    
    const input = screen.getByPlaceholderText('Add ingredient');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', target: { value: 'tomato' } });
    
    const button = screen.getByText('Get Recommendation');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Test Recipe')).toBeInTheDocument();
      expect(screen.getByText('step1')).toBeInTheDocument();
      expect(screen.getByText('tip1')).toBeInTheDocument();
    });
  });

  it('should handle API errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    renderComponent();
    
    const input = screen.getByPlaceholderText('Add ingredient');
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', target: { value: 'tomato' } });
    
    const button = screen.getByText('Get Recommendation');
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error getting recommendation');
    });
  });
});