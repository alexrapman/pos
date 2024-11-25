// src/services/SystemTrayService.ts
import { app, Tray, Menu, nativeImage } from 'electron';
import path from 'path';
import { Order } from '../models/Order';

export class SystemTrayService {
    private tray: Tray | null = null;
    private priorityOrders: Set<string> = new Set();

    constructor(private mainWindow: Electron.BrowserWindow) {
        this.initializeTray();
    }

    private initializeTray() {
        const icon = nativeImage.createFromPath(
            path.join(__dirname, '../assets/tray-icon.png')
        );

        this.tray = new Tray(icon);
        this.updateContextMenu();

        this.tray.on('click', () => {
            this.mainWindow.show();
        });
    }

    private updateContextMenu() {
        const contextMenu = Menu.buildFromTemplate([
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
                click: () => app.quit()
            }
        ]);

        this.tray?.setContextMenu(contextMenu);
    }

    public addPriorityOrder(order: Order) {
        this.priorityOrders.add(order.id);
        this.updateContextMenu();
        this.tray?.setImage(path.join(__dirname, '../assets/tray-icon-alert.png'));
    }

    public removePriorityOrder(orderId: string) {
        this.priorityOrders.delete(orderId);
        this.updateContextMenu();

        if (this.priorityOrders.size === 0) {
            this.tray?.setImage(path.join(__dirname, '../assets/tray-icon.png'));
        }
    }

    private focusOrder(orderId: string) {
        this.mainWindow.show();
        this.mainWindow.webContents.send('focus-order', orderId);
    }
}