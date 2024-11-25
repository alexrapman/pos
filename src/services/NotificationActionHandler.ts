// src/services/NotificationActionHandler.ts
import { ipcMain } from 'electron';
import { WindowsVolumeService } from './WindowsVolumeService';
import { WindowsSoundPlayer } from './WindowsSounds';

export class NotificationActionHandler {
    private static readonly ACTIONS = {
        TOGGLE_MUTE: 'toggle-mute',
        SET_VOLUME: 'set-volume',
        RESET_VOLUME: 'reset-volume'
    };

    constructor() {
        this.registerHandlers();
    }

    private registerHandlers() {
        ipcMain.handle('notification-action', async (_, action: string, data?: any) => {
            try {
                await this.handleAction(action, data);
                WindowsSoundPlayer.playSystemSound('select');
            } catch (error) {
                console.error('Action handler error:', error);
                WindowsSoundPlayer.playSystemSound('error');
            }
        });
    }

    private async handleAction(action: string, data?: any) {
        switch (action) {
            case this.ACTIONS.TOGGLE_MUTE:
                const currentVolume = await WindowsVolumeService.getSystemVolume();
                await WindowsVolumeService.toggleMute(currentVolume > 0);
                break;

            case this.ACTIONS.SET_VOLUME:
                if (typeof data === 'number') {
                    await WindowsVolumeService.setSystemVolume(data);
                }
                break;

            case this.ACTIONS.RESET_VOLUME:
                await WindowsVolumeService.setSystemVolume(1.0);
                await WindowsVolumeService.toggleMute(false);
                break;

            default:
                throw new Error(`Unknown action: ${action}`);
        }
    }
}