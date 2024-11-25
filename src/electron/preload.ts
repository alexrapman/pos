// src/electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    orderService: {
        notifyPriority: (order: any) =>
            ipcRenderer.send('order:priority', order),
        notifyComplete: (orderId: string) =>
            ipcRenderer.send('order:completed', orderId),
        onFocusOrder: (callback: (orderId: string) => void) =>
            ipcRenderer.on('focus-order', (_, orderId) => callback(orderId))
    },
    window: {
        minimize: () => ipcRenderer.send('window:minimize'),
        maximize: () => ipcRenderer.send('window:maximize'),
        close: () => ipcRenderer.send('window:close')
    }
});

// src/components/WindowControls.tsx
import React from 'react';

declare global {
    interface Window {
        electron: {
            window: {
                minimize: () => void;
                maximize: () => void;
                close: () => void;
            };
        };
    }
}

export const WindowControls: React.FC = () => {
    return (
        <div className= "fixed top-0 right-0 flex gap-2 p-2" >
        <button
                onClick={ () => window.electron.window.minimize() }
    className = "w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded"
        >
        _
        </button>
        < button
    onClick = {() => window.electron.window.maximize()}
className = "w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded"
    >
                □
</button>
    < button
onClick = {() => window.electron.window.close()}
className = "w-6 h-6 bg-red-500 hover:bg-red-600 rounded text-white"
    >
                ×
</button>
    </div>
    );
};