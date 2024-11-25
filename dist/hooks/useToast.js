"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToast = void 0;
// src/hooks/useToast.ts
const react_1 = require("react");
const ToastContext_1 = require("../context/ToastContext");
const useToast = () => {
    const context = (0, react_1.useContext)(ToastContext_1.ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    const showToast = (0, react_1.useCallback)((options) => {
        context.addToast(options);
    }, [context]);
    const toast = {
        success: (message, duration) => showToast({ type: 'success', message, duration }),
        error: (message, duration) => showToast({ type: 'error', message, duration }),
        warning: (message, duration) => showToast({ type: 'warning', message, duration }),
        info: (message, duration) => showToast({ type: 'info', message, duration })
    };
    return { toast, showToast };
};
exports.useToast = useToast;
