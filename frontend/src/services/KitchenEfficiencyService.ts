// frontend/src/services/KitchenEfficiencyService.ts
import { format, differenceInMinutes } from 'date-fns';

interface OrderMetrics {
  orderId: number;
  startTime: Date;
  completionTime?: Date;
  itemCount: number;
  complexity: 'low' | 'medium' | 'high';
}

export class KitchenEfficiencyService {
  private readonly TARGET_TIMES = {
    low: 10,    // 10 minutes
    medium: 15, // 15 minutes
    high: 25    // 25 minutes
  };

  calculateEfficiency(orders: OrderMetrics[]): {
    overallEfficiency: number;
    itemsPerHour: number;
    avgPrepTime: number;
    performanceScore: number;
  } {
    const completedOrders = orders.filter(o => o.completionTime);
    
    // Calculate average preparation time
    const prepTimes = completedOrders.map(order => 
      differenceInMinutes(
        new Date(order.completionTime!),
        new Date(order.startTime)
      )
    );
    
    const avgPrepTime = prepTimes.length > 0 
      ? prepTimes.reduce((a, b) => a + b, 0) / prepTimes.length 
      : 0;

    // Calculate orders meeting target time
    const ordersOnTarget = completedOrders.filter(order => {
      const prepTime = differenceInMinutes(
        new Date(order.completionTime!),
        new Date(order.startTime)
      );
      return prepTime <= this.TARGET_TIMES[order.complexity];
    });

    // Overall efficiency (orders completed within target time)
    const overallEfficiency = completedOrders.length > 0
      ? (ordersOnTarget.length / completedOrders.length) * 100
      : 0;

    // Items per hour
    const totalItems = completedOrders.reduce((sum, order) => 
      sum + order.itemCount, 0
    );
    const totalHours = this.calculateTotalHours(completedOrders);
    const itemsPerHour = totalHours > 0 ? totalItems / totalHours : 0;

    // Performance score (weighted calculation)
    const performanceScore = this.calculatePerformanceScore({
      efficiency: overallEfficiency,
      avgPrepTime,
      itemsPerHour
    });

    return {
      overallEfficiency,
      itemsPerHour,
      avgPrepTime,
      performanceScore
    };
  }

  private calculateTotalHours(orders: OrderMetrics[]): number {
    if (orders.length === 0) return 0;

    const start = new Date(Math.min(...orders.map(o => 
      new Date(o.startTime).getTime()
    )));
    const end = new Date(Math.max(...orders.map(o => 
      new Date(o.completionTime!).getTime()
    )));

    return differenceInMinutes(end, start) / 60;
  }

  private calculatePerformanceScore(metrics: {
    efficiency: number,
    avgPrepTime: number,
    itemsPerHour: number
  }): number {
    // Weights for different factors
    const weights = {
      efficiency: 0.4,
      prepTime: 0.3,
      throughput: 0.3
    };

    // Normalize metrics to 0-100 scale
    const normalizedPrepTime = Math.max(0, 100 - (metrics.avgPrepTime / 0.3));
    const normalizedThroughput = Math.min(metrics.itemsPerHour * 5, 100);

    return (
      (metrics.efficiency * weights.efficiency) +
      (normalizedPrepTime * weights.prepTime) +
      (normalizedThroughput * weights.throughput)
    );
  }
}