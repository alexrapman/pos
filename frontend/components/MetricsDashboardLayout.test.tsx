// frontend/src/__tests__/components/MetricsDashboardLayout.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MetricsDashboardLayout } from '../../components/metrics/MetricsDashboardLayout';
import { MetricsProvider } from '../../context/MetricsContext';

describe('MetricsDashboardLayout', () => {
  const renderComponent = () => {
    return render(
      <MetricsProvider>
        <MetricsDashboardLayout />
      </MetricsProvider>
    );
  };

  it('should render all metric charts', () => {
    renderComponent();
    expect(screen.getByText('System Metrics')).toBeInTheDocument();
    expect(screen.getByText('Response Time')).toBeInTheDocument();
    expect(screen.getByText('Requests per Minute')).toBeInTheDocument();
    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
    expect(screen.getByText('CPU Usage')).toBeInTheDocument();
    expect(screen.getByText('Active Connections')).toBeInTheDocument();
  });

  it('should handle time range changes', () => {
    renderComponent();
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1d' } });
    expect(select).toHaveValue('1d');
  });

  it('should toggle auto refresh', () => {
    renderComponent();
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});