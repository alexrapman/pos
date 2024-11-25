// src/components/ErrorBoundary/GlobalErrorBoundary.tsx
import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { toast } from 'react-toastify';
import { logError } from '../../services/errorLogging';

interface FallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
    React.useEffect(() => {
        logError(error);
        toast.error('An unexpected error occurred');
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-4">
                        Oops! Something went wrong
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {error.message}
                    </p>
                    <button
                        onClick={resetErrorBoundary}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
};

export const GlobalErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ReactErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                // Reset application state here
                window.location.reload();
            }}
        >
            {children}
        </ReactErrorBoundary>
    );
};