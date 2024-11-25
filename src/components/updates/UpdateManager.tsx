// src/components/updates/UpdateManager.tsx
import React, { useEffect, useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { ProgressBar } from '../ui/ProgressBar';
import { FiDownload, FiRefreshCw } from 'react-icons/fi';

interface UpdateStatus {
    type: 'available' | 'progress' | 'ready';
    message: string;
    data?: {
        percent: number;
        speed: number;
        transferred: number;
        total: number;
    };
}

export const UpdateManager: React.FC = () => {
    const [status, setStatus] = useState<UpdateStatus | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handleUpdateStatus = (_: any, newStatus: UpdateStatus) => {
            setStatus(newStatus);
            if (newStatus.type === 'ready') {
                setShowPrompt(true);
            }
        };

        window.electron?.updates.on('update-status', handleUpdateStatus);
        return () => {
            window.electron?.updates.removeListener('update-status', handleUpdateStatus);
        };
    }, []);

    const handleCheckUpdates = () => {
        window.electron?.updates.check();
    };

    const handleInstall = () => {
        window.electron?.updates.install();
        setShowPrompt(false);
    };

    return (
        <>
            {status && (
                <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md">
                    <div className="flex items-center gap-2">
                        {status.type === 'progress' ? (
                            <FiDownload className="w-5 h-5 text-blue-500" />
                        ) : (
                            <FiRefreshCw className="w-5 h-5 text-green-500" />
                        )}
                        <span>{status.message}</span>
                    </div>

                    {status.type === 'progress' && status.data && (
                        <ProgressBar
                            progress={status.data.percent}
                            className="mt-2"
                        />
                    )}
                </div>
            )}

            <Dialog
                open={showPrompt}
                onClose={() => setShowPrompt(false)}
                title="Update Ready"
            >
                <div className="p-4">
                    <p>A new version is ready to install. Would you like to restart and install now?</p>
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={() => setShowPrompt(false)}
                            className="px-4 py-2 text-gray-600"
                        >
                            Later
                        </button>
                        <button
                            onClick={handleInstall}
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Install Now
                        </button>
                    </div>
                </div>
            </Dialog>
        </>
    );
};