// src/services/WindowsRegistryManager.ts
import { Registry } from 'winreg';
import { app } from 'electron';
import { promises as fs } from 'fs';
import path from 'path';

export class WindowsRegistryManager {
    private appRegKey: Registry;
    private uninstallRegKey: Registry;
    private appPath: string;

    constructor() {
        this.appPath = app.getPath('exe');

        // App registration key
        this.appRegKey = new Registry({
            hive: Registry.HKLM,
            key: '\\Software\\Restaurant-POS'
        });

        // Uninstall information
        this.uninstallRegKey = new Registry({
            hive: Registry.HKLM,
            key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\RestaurantPOS'
        });
    }

    public async registerApplication(): Promise<void> {
        try {
            await this.setRegistryValue('InstallLocation', this.appPath);
            await this.setRegistryValue('Version', app.getVersion());
            await this.setRegistryValue('Publisher', 'Restaurant POS');
            await this.setUninstallInformation();
        } catch (error) {
            console.error('Failed to register application:', error);
            throw error;
        }
    }

    private async setRegistryValue(name: string, value: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.appRegKey.set(name, Registry.REG_SZ, value, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    private async setUninstallInformation(): Promise<void> {
        const uninstallValues = [
            { name: 'DisplayName', value: 'Restaurant POS' },
            { name: 'DisplayVersion', value: app.getVersion() },
            { name: 'Publisher', value: 'Restaurant POS' },
            { name: 'UninstallString', value: `"${path.join(this.appPath, 'uninstall.exe')}"` },
            { name: 'DisplayIcon', value: this.appPath },
            { name: 'InstallLocation', value: path.dirname(this.appPath) }
        ];

        for (const { name, value } of uninstallValues) {
            await new Promise((resolve, reject) => {
                this.uninstallRegKey.set(name, Registry.REG_SZ, value, (err) => {
                    if (err) reject(err);
                    else resolve(null);
                });
            });
        }
    }
}