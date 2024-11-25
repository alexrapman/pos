// src/services/NotificationTrackingService.ts
import { writeFileSync, readFileSync, existsSync } from 'fs';
import path from 'path';

interface NotificationInteraction {
    timestamp: number;
    action: string;
    successful: boolean;
    responseTime?: number;
}

export class NotificationTrackingService {
    private readonly storageFile: string;
    private interactions: NotificationInteraction[] = [];

    constructor() {
        this.storageFile = path.join(process.env.APPDATA!, 'RestaurantPOS', 'notification-tracking.json');
        this.loadInteractions();
    }

    trackInteraction(action: string, successful: boolean, responseTime?: number) {
        const interaction: NotificationInteraction = {
            timestamp: Date.now(),
            action,
            successful,
            responseTime
        };

        this.interactions.push(interaction);
        this.saveInteractions();
    }

    private loadInteractions() {
        try {
            if (existsSync(this.storageFile)) {
                const data = readFileSync(this.storageFile, 'utf8');
                this.interactions = JSON.parse(data);
            }
        } catch (error) {
            console.error('Failed to load interaction history:', error);
        }
    }

    private saveInteractions() {
        try {
            writeFileSync(this.storageFile, JSON.stringify(this.interactions, null, 2));
        } catch (error) {
            console.error('Failed to save interaction history:', error);
        }
    }

    generateReport(): Record<string, any> {
        const lastDay = this.interactions.filter(i =>
            i.timestamp > Date.now() - 24 * 60 * 60 * 1000
        );

        return {
            totalInteractions: this.interactions.length,
            successRate: this.calculateSuccessRate(lastDay),
            averageResponseTime: this.calculateAverageResponseTime(lastDay),
            mostCommonAction: this.findMostCommonAction(lastDay)
        };
    }

    private calculateSuccessRate(interactions: NotificationInteraction[]): number {
        if (!interactions.length) return 0;
        return interactions.filter(i => i.successful).length / interactions.length;
    }

    private calculateAverageResponseTime(interactions: NotificationInteraction[]): number {
        const validTimes = interactions.filter(i => i.responseTime).map(i => i.responseTime!);
        if (!validTimes.length) return 0;
        return validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length;
    }

    private findMostCommonAction(interactions: NotificationInteraction[]): string {
        const actionCounts = interactions.reduce((acc, i) => {
            acc[i.action] = (acc[i.action] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(actionCounts)
            .sort(([, a], [, b]) => b - a)[0]?.[0] || '';
    }
}