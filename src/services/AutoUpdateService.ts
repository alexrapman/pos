// src/services/AutoUpdateService.ts
import { autoUpdater } from 'electron-updater';
import { BrowserWindow, ipcMain } from 'electron';
import log from 'electron-log';

export class AutoUpdateService {
    private mainWindow: BrowserWindow;

    constructor(window: BrowserWindow) {
        this.mainWindow = window;

        // Configure logging
        log.transports.file.level = 'info';
        autoUpdater.logger = log;

        // Configure update server
        autoUpdater.setFeedURL({
            provider: 'github',
            owner: 'your-username',
            repo: 'restaurant-pos'
        });

        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        autoUpdater.on('checking-for-update', () => {
            this.sendStatusToWindow('Checking for updates...');
        });

        autoUpdater.on('update-available', (info) => {
            this.sendStatusToWindow('Update available.', info);
        });

        autoUpdater.on('update-not-available', () => {
            this.sendStatusToWindow('Application is up to date.');
        });

        autoUpdater.on('error', (err) => {
            this.sendStatusToWindow('Error in auto-updater.', err);
        });

        autoUpdater.on('download-progress', (progressObj) => {
            this.sendStatusToWindow('Download progress', progressObj);
        });

        autoUpdater.on('update-downloaded', (info) => {
            this.sendStatusToWindow('Update downloaded', info);
            this.promptForUpdate();
        });
    }

    private sendStatusToWindow(message: string, data?: any) {
        this.mainWindow.webContents.send('update-status', { message, data });
    }

    private promptForUpdate() {
        this.mainWindow.webContents.send('update-prompt');

        ipcMain.once('update-response', (_, install) => {
            if (install) {
                autoUpdater.quitAndInstall();
            }
        });
    }

    public checkForUpdates() {
        autoUpdater.checkForUpdates();
    }
}