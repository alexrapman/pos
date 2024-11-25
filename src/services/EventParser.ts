// src/services/EventParser.ts
export class EventParser {
    private filters: Map<string, (event: any) => boolean> = new Map();

    constructor() {
        this.initializeDefaultFilters();
    }

    private initializeDefaultFilters() {
        this.filters.set('notification', (event) =>
            event.eventName.includes('Notification'));

        this.filters.set('performance', (event) =>
            event.eventName.includes('Performance'));

        this.filters.set('error', (event) =>
            event.eventId >= 1000 && event.eventId < 2000);
    }

    parseEvent(rawEvent: string): any {
        try {
            const event = JSON.parse(rawEvent);
            return {
                ...event,
                timestamp: new Date(event.timestamp),
                category: this.categorizeEvent(event),
                performance: this.extractPerformanceMetrics(event)
            };
        } catch (error) {
            console.error('Event parsing failed:', error);
            return null;
        }
    }

    private categorizeEvent(event: any): string {
        for (const [category, filter] of this.filters) {
            if (filter(event)) return category;
        }
        return 'other';
    }

    private extractPerformanceMetrics(event: any): any {
        return {
            processingTime: this.calculateProcessingTime(event),
            systemLoad: this.getSystemLoad(),
            memoryUsage: this.getMemoryUsage()
        };
    }

    private calculateProcessingTime(event: any): number {
        const start = new Date(event.timestamp).getTime();
        const end = Date.now();
        return end - start;
    }

    private getSystemLoad(): number {
        const output = require('child_process')
            .execSync('wmic cpu get loadpercentage')
            .toString();
        return parseInt(output.split('\n')[1]);
    }

    private getMemoryUsage(): number {
        const output = require('child_process')
            .execSync('wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /Value')
            .toString();

        const total = parseInt(output.match(/TotalVisibleMemorySize=(\d+)/)?.[1] || '0');
        const free = parseInt(output.match(/FreePhysicalMemory=(\d+)/)?.[1] || '0');

        return ((total - free) / total) * 100;
    }
}