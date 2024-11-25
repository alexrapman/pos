// frontend/src/config/alertThresholds.ts
export const AlertThresholds = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  INFO: 'info'
} as const;

export interface ThresholdRule {
  metric: string;
  operator: '<' | '>' | '<==' | '>==' | '===';
  value: number;
  level: typeof AlertThresholds[keyof typeof AlertThresholds];
  message: string;
}
