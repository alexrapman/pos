// src/services/errorLogging.ts
import * as Sentry from '@sentry/browser';
import { EventLogger } from 'node-windows';

interface ErrorLog {
    message: string;
    stack?: string;
    timestamp: string;
    severity: 'error' | 'warning' | 'info';
    context?: Record<string, any>;
}

class ErrorLoggingService {
    private eventLogger: any;

    constructor() {
        // Initialize Sentry
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            environment: process.env.NODE_ENV,
            tracesSampleRate: 1.0,
        });

        // Initialize Windows Event Logger
        this.eventLogger = new EventLogger({
            source: 'RestaurantPOS',
            eventLog: 'Application'
        });
    }

    async logError(error: Error, context?: Record<string, any>) {
        const errorLog: ErrorLog = {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            severity: 'error',
            context
        };

        // Log to Sentry
        Sentry.captureException(error, {
            extra: context
        });

        // Log to Windows Event Log
        this.eventLogger.error(error.message, error.stack);

        // Log to local storage for debugging
        this.logToLocalStorage(errorLog);

        // Console log in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error:', errorLog);
        }
    }

    private logToLocalStorage(log: ErrorLog) {
        try {
            const logs = JSON.parse(localStorage.getItem('error_logs') || '[]');
            logs.push(log);
            localStorage.setItem('error_logs', JSON.stringify(logs.slice(-100)));
        } catch (e) {
            console.error('Failed to log to localStorage:', e);
        }
    }
}

export const errorLogger = new ErrorLoggingService();