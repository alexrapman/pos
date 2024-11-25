// src/services/WindowsAlertService.ts
import { Notification } from 'electron';
import path from 'path';

export enum AlertSeverity {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
    CRITICAL = 'critical'
}

interface AlertOptions {
    title: string;
    message: string;
    severity: AlertSeverity;
    action?: () => void;
}

export class WindowsAlertService {
    private soundMap: Map<AlertSeverity, string>;
    private alertQueue: AlertOptions[] = [];
    private isProcessing = false;

    constructor() {
        this.soundMap = new Map([
            [AlertSeverity.INFO, 'notification.wav'],
            [AlertSeverity.WARNING, 'alert.wav'],
            [AlertSeverity.ERROR, 'error.wav'],
            [AlertSeverity.CRITICAL, 'critical.wav']
        ]);
    }

    public async showAlert(options: AlertOptions): Promise<void> {
        this.alertQueue.push(options);
        if (!this.isProcessing) {
            await this.processQueue();
        }
    }

    private async processQueue(): Promise<void> {
        this.isProcessing = true;

        while (this.alertQueue.length > 0) {
            const alert = this.alertQueue.shift()!;
            await this.displayAlert(alert);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        this.isProcessing = false;
    }

    private async displayAlert(options: AlertOptions): Promise<void> {
        const notification = new Notification({
            title: options.title,
            body: options.message,
            icon: path.join(__dirname, `../assets/${options.severity}.png`),
            silent: true // We'll handle sound manually
        });

        notification.show();

        if (options.action) {
            notification.on('click', options.action);
        }

        await this.playAlertSound(options.severity);
    }

    private async playAlertSound(severity: AlertSeverity): Promise<void> {
        const soundFile = this.soundMap.get(severity);
        if (!soundFile) return;

        const audio = new Audio(path.join(__dirname, `../assets/sounds/${soundFile}`));
        try {
            await audio.play();
        } catch (error) {
            console.error('Failed to play alert sound:', error);
        }
    }
}