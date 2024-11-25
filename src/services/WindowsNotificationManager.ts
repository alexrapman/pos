// src/services/WindowsNotificationManager.ts
import { Notification } from 'electron';
import path from 'path';

export class WindowsNotificationManager {
    private static readonly ICONS = {
        volume: path.join(__dirname, '../assets/volume.png'),
        mute: path.join(__dirname, '../assets/mute.png'),
        error: path.join(__dirname, '../assets/error.png')
    };

    static showVolumeNotification(volume: number, muted: boolean) {
        const notification = new Notification({
            title: muted ? 'Volume Muted' : 'Volume Changed',
            body: muted ? 'Audio is muted' : `Volume set to ${Math.round(volume * 100)}%`,
            icon: muted ? this.ICONS.mute : this.ICONS.volume,
            silent: true
        });

        notification.show();
    }

    static showErrorNotification(error: string) {
        const notification = new Notification({
            title: 'Volume Control Error',
            body: error,
            icon: this.ICONS.error
        });

        notification.show();
    }
}

// Updated VolumeSyncManager.ts
export class VolumeSyncManager extends EventEmitter {
    async updateVolume(volume: number, muted: boolean) {
        try {
            await WindowsVolumeService.setSystemVolume(volume);
            await WindowsVolumeService.toggleMute(muted);
            this.lastVolume = volume;
            this.lastMuted = muted;

            WindowsNotificationManager.showVolumeNotification(volume, muted);
        } catch (error) {
            WindowsNotificationManager.showErrorNotification(error.message);
        }
    }
}