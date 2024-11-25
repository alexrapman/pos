// src/utils/windowsSounds.ts
import { exec } from 'child_process';

type SystemSound = 'snap' | 'select' | 'notify' | 'error';

export class WindowsSoundPlayer {
    private static readonly SOUND_ALIASES = {
        snap: 'SystemDefault',
        select: 'MenuCommand',
        notify: 'Notification.Default',
        error: 'SystemHand'
    };

    private static audioCache = new Map<string, HTMLAudioElement>();

    static playSystemSound(sound: SystemSound): void {
        try {
            exec(`powershell -c (New-Object Media.SoundPlayer 'C:\\Windows\\Media\\${this.SOUND_ALIASES[sound]}.wav').PlaySync()`);
        } catch (error) {
            console.error(`Failed to play system sound: ${error}`);
        }
    }

    static async playCustomSound(url: string): Promise<void> {
        try {
            let audio = this.audioCache.get(url);

            if (!audio) {
                audio = new Audio(url);
                this.audioCache.set(url, audio);
            }

            await audio.play();
        } catch (error) {
            console.error(`Failed to play custom sound: ${error}`);
        }
    }

    static preloadSounds(urls: string[]): void {
        urls.forEach(url => {
            if (!this.audioCache.has(url)) {
                const audio = new Audio(url);
                audio.load();
                this.audioCache.set(url, audio);
            }
        });
    }
}