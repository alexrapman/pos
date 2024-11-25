// frontend/src/services/AlertThresholdService.ts
import { ThresholdRule, AlertThresholds } from '../config/alertThresholds';

export class AlertThresholdService {
  private rules: ThresholdRule[] = [
    {
      metric: 'performanceScore',
      operator: '<',
      value: 70,
      level: AlertThresholds.CRITICAL,
      message: 'Critical: Performance score below 70%'
    },
    {
      metric: 'avgPrepTime',
      operator: '>',
      value: 25,
      level: AlertThresholds.WARNING,
      message: 'Warning: Average preparation time exceeds 25 minutes'
    },
    {
      metric: 'orderQueue',
      operator: '>',
      value: 10,
      level: AlertThresholds.WARNING,
      message: 'Warning: High number of orders in queue'
    }
  ];

  checkThresholds(metrics: Record<string, number>): Array<{
    level: string;
    message: string;
  }> {
    return this.rules
      .filter(rule => this.evaluateRule(rule, metrics[rule.metric]))
      .map(({ level, message }) => ({ level, message }));
  }

  private evaluateRule(rule: ThresholdRule, value: number): boolean {
    switch (rule.operator) {
      case '<': return value < rule.value;
      case '>': return value > rule.value;
      case '<=': return value <= rule.value;
      case '>=': return value >= rule.value;
      case '===': return value === rule.value;
      default: return false;
    }
  }
}