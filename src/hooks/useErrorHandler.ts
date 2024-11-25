// src/hooks/useErrorHandler.ts
import { useCallback } from 'react';
import { errorLogger } from '../services/errorLogging';
import { useToastUtils } from '../utils/toastUtils';

export const useErrorHandler = () => {
    const { notifyError } = useToastUtils();

    const handleError = useCallback(async (error: Error, context?: Record<string, any>) => {
        await errorLogger.logError(error, context);

        notifyError(error.message, 5000);
    }, [notifyError]);

    return { handleError };
};

// src/hooks/useRetry.ts
import { useState, useCallback } from 'react';

interface RetryConfig {
    maxAttempts?: number;
    delay?: number;
}

export const useRetry = ({ maxAttempts = 3, delay = 1000 }: RetryConfig = {}) => {
    const [attempts, setAttempts] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);

    const retry = useCallback(async (operation: () => Promise<any>) => {
        setIsRetrying(true);

        try {
            const result = await operation();
            setAttempts(0);
            return result;
        } catch (error) {
            if (attempts >= maxAttempts) {
                setIsRetrying(false);
                throw error;
            }

            setAttempts(prev => prev + 1);
            await new Promise(resolve => setTimeout(resolve, delay));
            return retry(operation);
        }
    }, [attempts, maxAttempts, delay]);

    return { retry, attempts, isRetrying };
};