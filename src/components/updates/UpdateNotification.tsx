// src/components/updates/UpdateNotification.tsx
import React, { useEffect, useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { ProgressBar } from '../ui/ProgressBar';

interface UpdateStatus {
    message: string;
    data?: {
        percent?: number;
        bytesPerSecond?: number;
        total?: number;
        transferred?: number;
    };
}

export const UpdateNotification: React.FC = () => {
    const [status, setStatus] = useState<UpdateStatus | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        window.electron?.updates.onStatus((newStatus: UpdateStatus) => {
            setStatus(newStatus);
        });

        window.electron?.updates.onPrompt(() => {
            setShowPrompt(true);
        });
    }, []);

    const handleUpdate = (install: boolean) => {
        window.electron?.updates.respondToPrompt(install);
        setShowPrompt(false);
    };

    return (
        <>
            {status && (
                <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                    <p className="text-sm text-gray-600">{status.message}</p>
                    {status.data?.percent && (
                        <ProgressBar
                            progress={status.data.percent}
                            className="mt-2"
                        />
                    )}
                </div>
            )}

            <Dialog
                open={showPrompt}
                onClose={() => handleUpdate(false)}
                title="Update Available"
            >
                <div className="p-4">
                    <p className="mb-4">A new version is ready to install.</p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => handleUpdate(false)}
                            className="px-4 py-2 text-gray-600"
                        >
                            Later
                        </button>
                        <button
                            onClick={() => handleUpdate(true)}
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