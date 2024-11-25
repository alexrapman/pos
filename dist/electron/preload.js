"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowControls = void 0;
// src/electron/preload.ts
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    orderService: {
        notifyPriority: (order) => electron_1.ipcRenderer.send('order:priority', order),
        notifyComplete: (orderId) => electron_1.ipcRenderer.send('order:completed', orderId),
        onFocusOrder: (callback) => electron_1.ipcRenderer.on('focus-order', (_, orderId) => callback(orderId))
    },
    window: {
        minimize: () => electron_1.ipcRenderer.send('window:minimize'),
        maximize: () => electron_1.ipcRenderer.send('window:maximize'),
        close: () => electron_1.ipcRenderer.send('window:close')
    }
});
const WindowControls = () => {
    return className = "fixed top-0 right-0 flex gap-2 p-2" >
        onClick;
    {
        () => window.electron.window.minimize();
    }
    className = "w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded"
        >
            _
        < /button>
        < button;
    onClick = {}();
};
exports.WindowControls = WindowControls;
window.electron.window.maximize();
className = "w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded"
    >
;
/button>
    < button;
onClick = {}();
window.electron.window.close();
className = "w-6 h-6 bg-red-500 hover:bg-red-600 rounded text-white"
    >
;
/button>
    < /div>;
;
;
