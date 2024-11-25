// mobile/src/hooks/useErrorTracking.ts
import { useState, useCallback } from 'react';
import { ErrorLoggingService, LogLevel } from '../services/ErrorLoggingService';

interface ErrorTrackingOptions {
  retryCount?: number;
  retryDelay?: number;
  context?: Record<string, any>;
}

export function useErrorTracking(options: ErrorTrackingOptions = {}) {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const logger = ErrorLoggingService.getInstance();

  const trackError = useCallback(async (
    operation: () => Promise<any>,
    context?: Record<string, any>
  ) => {
    const retryCount = options.retryCount || 3;
    const retryDelay = options.retryDelay || 1000;
    let lastError: Error;

    for (let attempt = 0; attempt < retryCount; attempt++) {
      try {
        const result = await operation();
        if (isError) {
          setIsError(false);
          setErrorMessage(undefined);
        }
        return result;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === retryCount - 1) {
          const errorId = await logger.logError(lastError, {
            ...options.context,
            ...context,
            attemptCount: attempt + 1
          });

          setIsError(true);
          setErrorMessage(lastError.message);
          
          await logger.logMessage(
            LogLevel.ERROR,
            `Operation failed after ${attempt + 1} attempts`,
            { errorId }
          );
        } else {
          await new Promise(resolve => 
            setTimeout(resolve, retryDelay * Math.pow(2, attempt))
          );
        }
      }
    }

    throw lastError!;
  }, [options]);

  return {
    isError,
    errorMessage,
    trackError
  };
}