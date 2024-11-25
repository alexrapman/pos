// src/electron/main.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import { SystemTrayService } from '../services/SystemTrayService';
import { WindowsNotificationService } from '../services/WindowsNotificationService';
import path from 'path';

let mainWindow: BrowserWindow;
let systemTray: SystemTrayService;
let notificationService: WindowsNotificationService;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadURL(
        app.isPackaged
            ? `file://${path.join(__dirname, '../build/index.html')}`
            : 'http://localhost:3000'
    );

    systemTray = new SystemTrayService(mainWindow);
    notificationService = new WindowsNotificationService();

    mainWindow.on('minimize', (event: Event) => {
        event.preventDefault();
        mainWindow.hide();
    });

    mainWindow.on('close', (event: Event) => {
        if (!app.isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// IPC handlers
ipcMain.on('order:priority', (_, order) => {
    systemTray.addPriorityOrder(order);
    notificationService.showNotification(
        'Priority Order',
        `Order #${order.id} for Table ${order.tableNumber} needs attention!`
    );
});

ipcMain.on('order:completed', (_, orderId) => {
    systemTray.removePriorityOrder(orderId);
});