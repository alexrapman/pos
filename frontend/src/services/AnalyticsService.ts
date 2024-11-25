// frontend/src/services/AnalyticsService.ts
import { PersistenceManager } from './PersistenceManager';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface SalesMetrics {
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: number;
    name: string;
    quantity: number;
    revenue: number;
  }>;
}

interface PerformanceMetrics {
  averagePreparationTime: number;
  peakHours: Array<{
    hour: number;
    orderCount: number;
  }>;
  tableUtilization: number;
}

export class AnalyticsService {
  private persistence: PersistenceManager;

  constructor() {
    this.persistence = PersistenceManager.getInstance();
  }

  async getDailySalesMetrics(date: Date = new Date()): Promise<SalesMetrics> {
    const response = await fetch(`${API_URL}/api/analytics/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        startDate: startOfDay(date).toISOString(),
        endDate: endOfDay(date).toISOString()
      })
    });

    return await response.json();
  }

  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const response = await fetch(`${API_URL}/api/analytics/performance`);
    return await response.json();
  }

  async getSalesComparison(days: number = 7): Promise<any> {
    const dates = Array.from({ length: days }, (_, i) => 
      format(subDays(new Date(), i), 'yyyy-MM-dd')
    );

    const metrics = await Promise.all(
      dates.map(date => this.getDailySalesMetrics(new Date(date)))
    );

    return dates.map((date, i) => ({
      date,
      ...metrics[i]
    }));
  }
}