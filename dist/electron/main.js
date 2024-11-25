"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/electron/main.ts
const electron_1 = require("electron");
const SystemTrayService_1 = require("../services/SystemTrayService");
const WindowsNotificationService_1 = require("../services/WindowsNotificationService");
const path_1 = __importDefault(require("path"));
let mainWindow;
let systemTray;
let notificationService;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadURL(electron_1.app.isPackaged
        ? `file://${path_1.default.join(__dirname, '../build/index.html')}`
        : 'http://localhost:3000');
    systemTray = new SystemTrayService_1.SystemTrayService(mainWindow);
    notificationService = new WindowsNotificationService_1.WindowsNotificationService();
    mainWindow.on('minimize', (event) => {
        event.preventDefault();
        mainWindow.hide();
    });
    mainWindow.on('close', (event) => {
        if (!electron_1.app.isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });
}
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
// IPC handlers
electron_1.ipcMain.on('order:priority', (_, order) => {
    systemTray.addPriorityOrder(order);
    notificationService.showNotification('Priority Order', `Order #${order.id} for Table ${order.tableNumber} needs attention!`);
});
electron_1.ipcMain.on('order:completed', (_, orderId) => {
    systemTray.removePriorityOrder(orderId);
});
