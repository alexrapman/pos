// backend/src/services/EventTracker.ts
import { createClient } from 'redis';

class EventTracker {
    private client;

    constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL
        });
        this.client.connect();
    }

    async trackEvent(eventType: string, data: any) {
        const event = {
            type: eventType,
            data,
            timestamp: new Date().toISOString()
        };

        await this.client.xAdd(
            'events',
            '*',
            { ...event }
        );
    }
}

export default new EventTracker();