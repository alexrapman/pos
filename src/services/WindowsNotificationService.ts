// src/services/WindowsNotificationService.ts
import { Notification } from 'electron';
import path from 'path';

export class WindowsNotificationService {
    private static readonly ICONS = {
        success: path.join(__dirname, '../assets/success.png'),
        error: path.join(__dirname, '../assets/error.png'),
        progress: path.join(__dirname, '../assets/progress.png')
    };

    private ps: PowerShell;
    private appId: string;

    constructor(appId: string = 'RestaurantPOS') {
        this.ps = new PowerShell({
            executionPolicy: 'Bypass',
            noProfile: true
        });
        this.appId = appId;
    }

    async showNotification(title: string, message: string, icon?: string) {
        const script = `
            [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
            [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null

            $template = @"
            <toast>
                <visual>
                    <binding template="ToastGeneric">
                        <text>$title</text>
                        <text>$message</text>
                        ${icon ? `<image placement="appLogoOverride" src="${icon}"/>` : ''}
                    </binding>
                </visual>
                <audio src="ms-winsoundevent:Notification.Default"/>
            </toast>
"@

            $xml = New-Object Windows.Data.Xml.Dom.XmlDocument
            $xml.LoadXml($template)
            $toast = [Windows.UI.Notifications.ToastNotification]::new($xml)
            [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier("${this.appId}").Show($toast)
        `;

        try {
            await this.ps.invoke(script);
        } catch (error) {
            console.error('Failed to show Windows notification:', error);
        }
    }

    showExportProgress(progress: number): void {
        const notification = new Notification({
            title: 'Exportación en Progreso',
            body: `Progreso: ${Math.round(progress)}%`,
            icon: this.ICONS.progress,
            silent: true
        });
        notification.show();
    }

    showExportSuccess(filePath: string): void {
        const notification = new Notification({
            title: 'Exportación Completada',
            body: 'Haz clic para abrir la ubicación del archivo',
            icon: this.ICONS.success
        });

        notification.on('click', () => {
            require('child_process').exec(`explorer.exe /select,"${filePath}"`);
        });

        notification.show();
    }

    showExportError(error: string): void {
        const notification = new Notification({
            title: 'Error en la Exportación',
            body: error,
            icon: this.ICONS.error
        });
        notification.show();
    }

    async dispose() {
        await this.ps.dispose();
    }
}