// src/services/WindowsEventTrace.ts
import { EventEmitter } from 'events';
import { execSync, spawn } from 'child_process';

interface TraceEvent {
    timestamp: string;
    eventId: number;
    eventName: string;
    data: any;
}

export class WindowsEventTrace extends EventEmitter {
    private sessionName: string;
    private provider: string;
    private traceProcess: any;

    constructor(provider: string) {
        super();
        this.provider = provider;
        this.sessionName = `POS_Trace_${Date.now()}`;
    }

    startCollection(callback: (event: TraceEvent) => void): void {
        // Start ETW session
        execSync(`logman create trace "${this.sessionName}" -p "${this.provider}" -o trace.etl -ets`);

        // Real-time collection using PowerShell
        const psScript = `
            $session = New-Object System.Diagnostics.Eventing.Reader.EventLogSession
            $subscription = $session.SubscribeToRealTimeEvents("${this.provider}", @{})
            $subscription.EnableRaisingEvents = $true
            Register-ObjectEvent -InputObject $subscription -EventName "EventRecordWritten" -Action {
                $event = $EventArgs.EventRecord
                Write-Host (ConvertTo-Json @{
                    timestamp = $event.TimeCreated
                    eventId = $event.Id
                    eventName = $event.TaskDisplayName
                    data = $event.Properties | ForEach-Object { $_.Value }
                })
            }
        `;

        this.traceProcess = spawn('powershell', ['-Command', psScript]);

        this.traceProcess.stdout.on('data', (data: Buffer) => {
            try {
                const event = JSON.parse(data.toString());
                callback(event);
            } catch (error) {
                console.error('Failed to parse event data:', error);
            }
        });
    }

    stopCollection(): void {
        if (this.traceProcess) {
            this.traceProcess.kill();
        }
        execSync(`logman stop "${this.sessionName}" -ets`);
        execSync(`logman delete "${this.sessionName}" -ets`);
    }
}