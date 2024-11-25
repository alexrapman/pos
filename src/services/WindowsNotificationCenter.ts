// src/services/WindowsNotificationCenter.ts
import { shell } from 'electron';
import { PowerShell } from 'node-powershell';

export class WindowsNotificationCenter {
    private ps: PowerShell;
    private appId = 'RestaurantPOS.Volume';

    constructor() {
        this.ps = new PowerShell({
            executionPolicy: 'Bypass',
            noProfile: true
        });
    }

    async showVolumeToast(volume: number, muted: boolean) {
        const template = `
            [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
            [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null

            $template = @"
            <toast>
                <visual>
                    <binding template='ToastGeneric'>
                        <text>${muted ? 'Volume Muted' : 'Volume Changed'}</text>
                        <text>${muted ? 'Audio is muted' : `Volume: ${Math.round(volume * 100)}%`}</text>
                        <progress 
                            value="${volume}" 
                            valueStringOverride="${Math.round(volume * 100)}%" 
                            status="Volume level"
                        />
                    </binding>
                </visual>
                <actions>
                    <action
                        content="${muted ? 'Unmute' : 'Mute'}"
                        arguments="toggle-mute"
                    />
                </actions>
            </toast>
"@

            $xml = New-Object Windows.Data.Xml.Dom.XmlDocument
            $xml.LoadXml($template)
            $toast = [Windows.UI.Notifications.ToastNotification]::new($xml)
            [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier("${this.appId}").Show($toast)
        `;

        try {
            await this.ps.invoke(template);
        } catch (error) {
            console.error('Failed to show toast notification:', error);
        }
    }

    async dispose() {
        await this.ps.dispose();
    }
}