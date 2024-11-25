// src/services/AlertService.ts
import { EventEmitter } from 'events';
import { Notification } from 'electron';
import path from 'path';

interface Alert {
    id: string;
    type: 'error' | 'warning' | 'info';
    message: string;
    timestamp: Date;
    severity: number; // 1-5
    acknowledged: boolean;
}

export class AlertService extends EventEmitter {
    private alerts: Alert[] = [];
    private readonly MAX_ALERTS = 100;
    private readonly ICONS_PATH = path.join(__dirname, '../assets/icons');

    async createAlert(
        type: Alert['type'],
        message: string,
        severity: number
    ): Promise<Alert> {
        const alert: Alert = {
            id: crypto.randomUUID(),
            type,
            message,
            timestamp: new Date(),
            severity,
            acknowledged: false
        };

        this.alerts.unshift(alert);
        this.alerts = this.alerts.slice(0, this.MAX_ALERTS);

        // Emitir evento para UI
        this.emit('new-alert', alert);

        // Mostrar notificación Windows
        this.showWindowsNotification(alert);

        // Guardar en log si es error
        if (type === 'error') {
            await this.logAlert(alert);
        }

        return alert;
    }

    private showWindowsNotification(alert: Alert) {
        const notification = new Notification({
            title: this.getAlertTitle(alert),
            body: alert.message,
            icon: path.join(this.ICONS_PATH, `${alert.type}.png`),
            urgency: alert.severity > 3 ? 'critical' : 'normal'
        });

        notification.show();
    }

    private getAlertTitle(alert: Alert): string {
        switch (alert.type) {
            case 'error':
                return '❌ Error del Sistema';
            case 'warning':
                return '⚠️ Advertencia';
            default:
                return 'ℹ️ Información';
        }
    }

    private async logAlert(alert: Alert): Promise<void> {
        // Implementar logging a archivo/BD
    }

    getActiveAlerts(): Alert[] {
        return this.alerts.filter(a => !a.acknowledged);
    }

    acknowledgeAlert(id: string): void {
        const alert = this.alerts.find(a => a.id === id);
        if (alert) {
            alert.acknowledged = true;
            this.emit('alert-updated', alert);
        }
    }
}