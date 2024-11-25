// src/services/UpdateIntegrationService.ts
import { ipcMain, BrowserWindow, Tray } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';

export class UpdateIntegrationService {
    private window: BrowserWindow;
    private tray: Tray;
    private updateAvailable: boolean = false;

    constructor(window: BrowserWindow, tray: Tray) {
        this.window = window;
        this.tray = tray;
        this.initialize();
    }

    private initialize() {
        // Update checking events
        autoUpdater.on('update-available', () => {
            this.updateAvailable = true;
            this.tray.setImage(path.join(__dirname, '../assets/tray-icon-update.png'));
            this.tray.setToolTip('Restaurant POS - Update Available');
            this.window.webContents.send('update-status', {
                type: 'available',
                message: 'A new update is available'
            });
        });

        // Download progress
        autoUpdater.on('download-progress', (progress) => {
            this.window.webContents.send('update-status', {
                type: 'progress',
                message: 'Downloading update...',
                data: {
                    percent: progress.percent,
                    speed: progress.bytesPerSecond,
                    transferred: progress.transferred,
                    total: progress.total
                }
            });
        });

        // Update downloaded
        autoUpdater.on('update-downloaded', () => {
            this.window.webContents.send('update-status', {
                type: 'ready',
                message: 'Update ready to install'
            });
        });

        // Handle IPC messages
        ipcMain.on('check-updates', () => {
            autoUpdater.checkForUpdates();
        });

        ipcMain.on('install-update', () => {
            autoUpdater.quitAndInstall(false, true);
        });
    }

    public checkForUpdates() {
        if (!this.updateAvailable) {
            autoUpdater.checkForUpdates();
        }
    }
}