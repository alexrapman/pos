export class RetryConfig {
    maxAttempts: number = 3;
    initialDelay: number = 1000;
    maxDelay: number = 10000;
    backoffFactor: number = 2;
  }