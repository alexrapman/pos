// src/services/WindowsUninstallHandler.ts
import { app, dialog } from 'electron';
import { Registry } from 'winreg';
import { promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';

export class WindowsUninstallHandler {
    private appPath: string;
    private registryKeys: string[] = [
        '\\Software\\Restaurant-POS',
        '\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\RestaurantPOS'
    ];

    constructor() {
        this.appPath = app.getPath('exe');
    }

    public async uninstall(): Promise<void> {
        try {
            const confirmed = await this.showConfirmation();
            if (!confirmed) return;

            // Stop all app processes
            await this.stopApplicationProcesses();

            // Clean registry
            await this.cleanRegistry();

            // Remove files
            await this.cleanFiles();

            // Show completion message
            await dialog.showMessageBox({
                type: 'info',
                title: 'Uninstall Complete',
                message: 'Restaurant POS has been successfully uninstalled.',
                buttons: ['OK']
            });

            // Exit process
            app.quit();
        } catch (error) {
            console.error('Uninstall failed:', error);
            throw error;
        }
    }

    private async showConfirmation(): Promise<boolean> {
        const { response } = await dialog.showMessageBox({
            type: 'question',
            title: 'Confirm Uninstall',
            message: 'Are you sure you want to uninstall Restaurant POS?',
            buttons: ['Yes', 'No'],
            defaultId: 1
        });
        return response === 0;
    }

    private async cleanRegistry(): Promise<void> {
        for (const keyPath of this.registryKeys) {
            const key = new Registry({
                hive: Registry.HKLM,
                key: keyPath
            });

            await new Promise((resolve, reject) => {
                key.destroy((err) => {
                    if (err) reject(err);
                    else resolve(null);
                });
            });
        }
    }

    private async cleanFiles(): Promise<void> {
        const appDir = path.dirname(this.appPath);
        await fs.rm(appDir, { recursive: true, force: true });
    }

    private async stopApplicationProcesses(): Promise<void> {
        return new Promise((resolve, reject) => {
            const taskkill = spawn('taskkill', ['/F', '/IM', 'restaurant-pos.exe']);
            taskkill.on('exit', (code) => {
                if (code === 0 || code === 128) resolve();
                else reject(new Error(`Failed to stop processes: ${code}`));
            });
        });
    }
}