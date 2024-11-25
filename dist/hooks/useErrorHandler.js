"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRetry = exports.useErrorHandler = void 0;
// src/hooks/useErrorHandler.ts
const react_1 = require("react");
const errorLogging_1 = require("../services/errorLogging");
const toastUtils_1 = require("../utils/toastUtils");
const useErrorHandler = () => {
    const { notifyError } = (0, toastUtils_1.useToastUtils)();
    const handleError = (0, react_1.useCallback)(async (error, context) => {
        await errorLogging_1.errorLogger.logError(error, context);
        notifyError(error.message, 5000);
    }, [notifyError]);
    return { handleError };
};
exports.useErrorHandler = useErrorHandler;
// src/hooks/useRetry.ts
const react_2 = require("react");
const useRetry = ({ maxAttempts = 3, delay = 1000 } = {}) => {
    const [attempts, setAttempts] = (0, react_2.useState)(0);
    const [isRetrying, setIsRetrying] = (0, react_2.useState)(false);
    const retry = (0, react_1.useCallback)(async (operation) => {
        setIsRetrying(true);
        try {
            const result = await operation();
            setAttempts(0);
            return result;
        }
        catch (error) {
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
exports.useRetry = useRetry;
