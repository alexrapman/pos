"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalErrorBoundary = void 0;
// src/components/ErrorBoundary/GlobalErrorBoundary.tsx
const react_1 = __importDefault(require("react"));
const react_error_boundary_1 = require("react-error-boundary");
const react_toastify_1 = require("react-toastify");
const errorLogging_1 = require("../../services/errorLogging");
const ErrorFallback = ({ error, resetErrorBoundary }) => {
    react_1.default.useEffect(() => {
        (0, errorLogging_1.logError)(error);
        react_toastify_1.toast.error('An unexpected error occurred');
    }, [error]);
    return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-4">
                        Oops! Something went wrong
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {error.message}
                    </p>
                    <button onClick={resetErrorBoundary} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                        Try Again
                    </button>
                </div>
            </div>
        </div>);
};
const GlobalErrorBoundary = ({ children }) => {
    return (<react_error_boundary_1.ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {
            // Reset application state here
            window.location.reload();
        }}>
            {children}
        </react_error_boundary_1.ErrorBoundary>);
};
exports.GlobalErrorBoundary = GlobalErrorBoundary;
