// src/services/WindowsVolumeService.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class WindowsVolumeService {
    static async getSystemVolume(): Promise<number> {
        try {
            const command = `powershell -command "Get-AudioDevice -Playback | Select-Object -ExpandProperty Volume"`;
            const { stdout } = await execAsync(command);
            return parseInt(stdout.trim()) / 100;
        } catch (error) {
            console.error('Failed to get system volume:', error);
            return 1;
        }
    }

    static async setSystemVolume(volume: number): Promise<void> {
        try {
            const volumePercent = Math.round(volume * 100);
            const command = `powershell -command "Set-AudioDevice -PlaybackVolume ${volumePercent}"`;
            await execAsync(command);
        } catch (error) {
            console.error('Failed to set system volume:', error);
        }
    }

    static async toggleMute(muted: boolean): Promise<void> {
        try {
            const command = `powershell -command "Set-AudioDevice -PlaybackMute ${muted}"`;
            await execAsync(command);
        } catch (error) {
            console.error('Failed to toggle mute:', error);
        }
    }
}