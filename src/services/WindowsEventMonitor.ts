// src/services/WindowsEventMonitor.ts
import { EventLogReader } from 'windows-eventlog';
import { EventEmitter } from 'events';
import { writeFileSync } from 'fs';
import path from 'path';

interface EventLogEntry {
    id: number;
    type: string;
    source: string;
    message: string;
    timestamp: Date;
    category: string;
}

export class WindowsEventMonitor extends EventEmitter {
    private readers: Map<string, EventLogReader> = new Map();
    private readonly LOGS_DIR: string;
    private readonly MONITORED_LOGS = ['System', 'Application'];

    constructor() {
        super();
        this.LOGS_DIR = path.join(process.env.APPDATA!, 'RestaurantPOS', 'event-logs');
        this.initialize();
    }

    private async initialize(): Promise<void> {
        if (!existsSync(this.LOGS_DIR)) {
            mkdirSync(this.LOGS_DIR, { recursive: true });
        }

        for (const logName of this.MONITORED_LOGS) {
            const reader = new EventLogReader(logName);
            this.readers.set(logName, reader);
            this.setupEventListener(reader, logName);
        }
    }

    private setupEventListener(reader: EventLogReader, logName: string): void {
        reader.on('event', (event) => {
            const entry: EventLogEntry = {
                id: event.id,
                type: event.type,
                source: event.source,
                message: event.message,
                timestamp: new Date(event.timestamp),
                category: logName
            };

            this.handleEvent(entry);
        });
    }

    private handleEvent(entry: EventLogEntry): void {
        this.emit('new-event', entry);
        this.saveEvent(entry);

        if (this.isCriticalEvent(entry)) {
            this.emit('critical-event', entry);
        }
    }

    private isCriticalEvent(entry: EventLogEntry): boolean {
        return entry.type === 'Error' ||
            entry.type === 'Critical' ||
            entry.message.toLowerCase().includes('critical');
    }

    private saveEvent(entry: EventLogEntry): void {
        const fileName = `events-${format(entry.timestamp, 'yyyyMMdd')}.json`;
        const filePath = path.join(this.LOGS_DIR, fileName);

        let events = [];
        if (existsSync(filePath)) {
            events = JSON.parse(readFileSync(filePath, 'utf8'));
        }

        events.push(entry);
        writeFileSync(filePath, JSON.stringify(events, null, 2));
    }
}