// mobile/src/utils/withRetry.ts
export async function withRetry<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const finalConfig = { ...new RetryConfig(), ...config };
    let lastError: Error;
    let delay = finalConfig.initialDelay;
  
    for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (attempt === finalConfig.maxAttempts) break;
  
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * finalConfig.backoffFactor, finalConfig.maxDelay);
      }
    }
  
    throw lastError!;
  }