// frontend/src/__tests__/components/AdvancedMetricsViewer.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AdvancedMetricsViewer } from '../../components/admin/AdvancedMetricsViewer';
import { useRealTimeMetrics, useMetricsFilter } from '../../hooks/useMetrics';

jest.mock('../../hooks/useMetrics');
jest.mock('react-chartjs-2', () => ({
  Line: () => null,
  Bar: () => null,
  Radar: () => null
}));

describe('AdvancedMetricsViewer', () => {
  const mockMetrics = {
    data: [20, 30, 40],
    current: 40,
    average: 30,
    max: 40,
    min: 20
  };

  beforeEach(() => {
    (useRealTimeMetrics as jest.Mock).mockReturnValue(mockMetrics);
    (useMetricsFilter as jest.Mock).mockReturnValue([20, 30, 40]);
  });

  it('renders metrics data correctly', () => {
    render(<AdvancedMetricsViewer />);
    
    expect(screen.getByText('CPU: 40.00%')).toBeInTheDocument();
    expect(screen.getByText('Average: 30.00%')).toBeInTheDocument();
    expect(screen.getByText('Max: 40.00%')).toBeInTheDocument();
    expect(screen.getByText('Min: 20.00%')).toBeInTheDocument();
  });

  it('handles time range changes', () => {
    render(<AdvancedMetricsViewer />);
    
    const select = screen.getByRole('combobox', { name: /time range/i });
    fireEvent.change(select, { target: { value: '900' } });
    
    expect(useMetricsFilter).toHaveBeenCalledWith(expect.any(String), 900);
  });

  it('changes chart type', () => {
    render(<AdvancedMetricsViewer />);
    
    const select = screen.getByRole('combobox', { name: /chart type/i });
    fireEvent.change(select, { target: { value: 'bar' } });
    
    expect(screen.getByTestId('chart-container')).toHaveAttribute('data-type', 'bar');
  });

  it('triggers CSV export', () => {
    const mockExport = jest.fn();
    (useMetricsExport as jest.Mock).mockReturnValue({ exportToCsv: mockExport });
    
    render(<AdvancedMetricsViewer />);
    
    fireEvent.click(screen.getByText('Export Data'));
    expect(mockExport).toHaveBeenCalled();
  });
});