"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemTrayService = void 0;
// src/services/SystemTrayService.ts
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
class SystemTrayService {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.tray = null;
        this.priorityOrders = new Set();
        this.initializeTray();
    }
    initializeTray() {
        const icon = electron_1.nativeImage.createFromPath(path_1.default.join(__dirname, '../assets/tray-icon.png'));
        this.tray = new electron_1.Tray(icon);
        this.updateContextMenu();
        this.tray.on('click', () => {
            this.mainWindow.show();
        });
    }
    updateContextMenu() {
        const contextMenu = electron_1.Menu.buildFromTemplate([
            {
                label: 'Open Restaurant POS',
                click: () => this.mainWindow.show()
            },
            {
                label: 'Priority Orders',
                enabled: this.priorityOrders.size > 0,
                submenu: Array.from(this.priorityOrders).map(orderId => ({
                    label: `Order #${orderId}`,
                    click: () => this.focusOrder(orderId)
                }))
            },
            { type: 'separator' },
            {
                label: 'Exit',
                click: () => electron_1.app.quit()
            }
        ]);
        this.tray?.setContextMenu(contextMenu);
    }
    addPriorityOrder(order) {
        this.priorityOrders.add(order.id);
        this.updateContextMenu();
        this.tray?.setImage(path_1.default.join(__dirname, '../assets/tray-icon-alert.png'));
    }
    removePriorityOrder(orderId) {
        this.priorityOrders.delete(orderId);
        this.updateContextMenu();
        if (this.priorityOrders.size === 0) {
            this.tray?.setImage(path_1.default.join(__dirname, '../assets/tray-icon.png'));
        }
    }
    focusOrder(orderId) {
        this.mainWindow.show();
        this.mainWindow.webContents.send('focus-order', orderId);
    }
}
exports.SystemTrayService = SystemTrayService;
