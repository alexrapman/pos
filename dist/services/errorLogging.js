"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = void 0;
// src/services/errorLogging.ts
const Sentry = __importStar(require("@sentry/browser"));
const node_windows_1 = require("node-windows");
class ErrorLoggingService {
    constructor() {
        // Initialize Sentry
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            environment: process.env.NODE_ENV,
            tracesSampleRate: 1.0,
        });
        // Initialize Windows Event Logger
        this.eventLogger = new node_windows_1.EventLogger({
            source: 'RestaurantPOS',
            eventLog: 'Application'
        });
    }
    async logError(error, context) {
        const errorLog = {
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
    logToLocalStorage(log) {
        try {
            const logs = JSON.parse(localStorage.getItem('error_logs') || '[]');
            logs.push(log);
            localStorage.setItem('error_logs', JSON.stringify(logs.slice(-100)));
        }
        catch (e) {
            console.error('Failed to log to localStorage:', e);
        }
    }
}
exports.errorLogger = new ErrorLoggingService();
