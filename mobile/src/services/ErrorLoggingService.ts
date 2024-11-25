// mobile/src/services/ErrorLoggingService.ts
import * as Sentry from '@sentry/react-native';
import Analytics from '@react-native-firebase/analytics';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  FATAL = 'fatal'
}

export class ErrorLoggingService {
  private static instance: ErrorLoggingService;
  private isInitialized = false;

  static getInstance(): ErrorLoggingService {
    if (!ErrorLoggingService.instance) {
      ErrorLoggingService.instance = new ErrorLoggingService();
    }
    return ErrorLoggingService.instance;
  }

  async initialize(dsn: string) {
    if (this.isInitialized) return;

    await Sentry.init({
      dsn,
      enableAutoSessionTracking: true,
      tracesSampleRate: 1.0,
    });

    this.isInitialized = true;
  }

  async logError(error: Error, context?: Record<string, any>) {
    const errorId = this.generateErrorId();

    // Send to Sentry
    Sentry.captureException(error, {
      extra: context,
      tags: {
        errorId
      }
    });

    // Log to Analytics
    await Analytics().logEvent('app_error', {
      error_id: errorId,
      error_name: error.name,
      error_message: error.message,
      ...context
    });

    return errorId;
  }

  async logMessage(
    level: LogLevel,
    message: string,
    context?: Record<string, any>
  ) {
    switch (level) {
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        Sentry.captureMessage(message, {
          level: level === LogLevel.FATAL ? 'fatal' : 'error',
          extra: context
        });
        break;
      default:
        Sentry.addBreadcrumb({
          category: 'log',
          message,
          level: level as any,
          data: context
        });
    }
  }

  private generateErrorId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}