// src/services/WindowsTrayManager.ts
import { Tray, Menu, app, BrowserWindow } from 'electron';
import path from 'path';

export class WindowsTrayManager {
    private tray: Tray | null = null;
    private mainWindow: BrowserWindow;
    private isQuitting = false;

    constructor(window: BrowserWindow) {
        this.mainWindow = window;
        this.initialize();
    }

    private initialize(): void {
        const iconPath = path.join(__dirname, '../assets/tray-icon.ico');
        this.tray = new Tray(iconPath);

        this.tray.setToolTip('Restaurant POS');
        this.updateContextMenu();

        this.tray.on('double-click', () => {
            this.mainWindow.show();
            this.mainWindow.focus();
        });

        app.on('before-quit', () => {
            this.isQuitting = true;
        });

        this.mainWindow.on('close', (event) => {
            if (!this.isQuitting) {
                event.preventDefault();
                this.mainWindow.hide();
            }
        });
    }

    private updateContextMenu(): void {
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Open Restaurant POS',
                click: () => {
                    this.mainWindow.show();
                    this.mainWindow.focus();
                }
            },
            {
                label: 'Kitchen Display',
                click: () => {
                    this.mainWindow.show();
                    this.mainWindow.webContents.send('navigate', '/kitchen');
                }
            },
            { type: 'separator' },
            {
                label: 'Check for Updates',
                click: () => {
                    this.mainWindow.webContents.send('check-updates');
                }
            },
            { type: 'separator' },
            {
                label: 'Quit',
                click: () => {
                    this.isQuitting = true;
                    app.quit();
                }
            }
        ]);

        this.tray?.setContextMenu(contextMenu);
    }

    public updateIcon(status: 'normal' | 'alert' | 'update'): void {
        if (!this.tray) return;

        const iconMap = {
            normal: 'tray-icon.ico',
            alert: 'tray-icon-alert.ico',
            update: 'tray-icon-update.ico'
        };

        this.tray.setImage(
            path.join(__dirname, `../assets/${iconMap[status]}`)
        );
    }
}