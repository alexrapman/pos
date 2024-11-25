// src/services/VolumeSyncManager.ts
import { debounce } from 'lodash';
import { WindowsVolumeService } from './WindowsVolumeService';
import { EventEmitter } from 'events';

export class VolumeSyncManager extends EventEmitter {
    private static instance: VolumeSyncManager;
    private watcher: any;
    private lastVolume: number = 1;
    private lastMuted: boolean = false;

    private constructor() {
        super();
        this.startWatching();
    }

    static getInstance(): VolumeSyncManager {
        if (!VolumeSyncManager.instance) {
            VolumeSyncManager.instance = new VolumeSyncManager();
        }
        return VolumeSyncManager.instance;
    }

    private startWatching() {
        const checkVolume = async () => {
            const volume = await WindowsVolumeService.getSystemVolume();
            if (volume !== this.lastVolume) {
                this.lastVolume = volume;
                this.emit('volumeChange', volume);
            }
        };

        // Poll for volume changes every second
        this.watcher = setInterval(checkVolume, 1000);

        // Debounced volume update to prevent rapid changes
        this.updateVolume = debounce(this.updateVolume.bind(this), 100);
    }

    async updateVolume(volume: number, muted: boolean) {
        try {
            await WindowsVolumeService.setSystemVolume(volume);
            await WindowsVolumeService.toggleMute(muted);
            this.lastVolume = volume;
            this.lastMuted = muted;
        } catch (error) {
            console.error('Failed to update volume:', error);
        }
    }

    dispose() {
        if (this.watcher) {
            clearInterval(this.watcher);
        }
    }
}