"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowsNotificationService = void 0;
// src/services/WindowsNotificationService.ts
const node_powershell_1 = require("node-powershell");
class WindowsNotificationService {
    constructor(appId = 'RestaurantPOS') {
        this.ps = new node_powershell_1.PowerShell({
            executionPolicy: 'Bypass',
            noProfile: true
        });
        this.appId = appId;
    }
    async showNotification(title, message, icon) {
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
        }
        catch (error) {
            console.error('Failed to show Windows notification:', error);
        }
    }
    async dispose() {
        await this.ps.dispose();
    }
}
exports.WindowsNotificationService = WindowsNotificationService;
