// src/services/WindowsUpdateHandler.ts
import { app, BrowserWindow } from 'electron';
import { Registry } from 'winreg';
import { spawn } from 'child_process';
import path from 'path';

export class WindowsUpdateHandler {
    private window: BrowserWindow;
    private regKey: Registry;
    private appPath: string;

    constructor(window: BrowserWindow) {
        this.window = window;
        this.appPath = app.getPath('exe');
        this.regKey = new Registry({
            hive: Registry.HKCU,
            key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
        });
    }

    public async checkSystemCompatibility(): Promise<boolean> {
        const osRelease = this.getWindowsRelease();
        const hasAdminRights = await this.checkAdminRights();
        const hasSpaceAvailable = await this.checkDiskSpace();

        return osRelease >= 10 && hasAdminRights && hasSpaceAvailable;
    }

    private async checkAdminRights(): Promise<boolean> {
        return new Promise((resolve) => {
            const test = spawn('net', ['session'], {
                windowsHide: true
            });

            test.on('exit', (code) => {
                resolve(code === 0);
            });
        });
    }

    private async checkDiskSpace(): Promise<boolean> {
        const { free } = await this.getDiskSpace(path.parse(this.appPath).root);
        const REQUIRED_SPACE = 500 * 1024 * 1024; // 500MB
        return free > REQUIRED_SPACE;
    }

    private getWindowsRelease(): number {
        const release = require('os').release();
        return parseInt(release.split('.')[0]);
    }

    private getDiskSpace(drive: string): Promise<{ free: number }> {
        return new Promise((resolve, reject) => {
            const wmic = spawn('wmic', [
                'logicaldisk',
                'where',
                `DeviceID='${drive}'`,
                'get',
                'freespace'
            ]);

            let output = '';
            wmic.stdout.on('data', (data) => {
                output += data.toString();
            });

            wmic.on('exit', () => {
                const lines = output.trim().split('\n');
                const freeSpace = parseInt(lines[1]);
                resolve({ free: freeSpace });
            });

            wmic.on('error', reject);
        });
    }
}