// backend/src/services/RedisCacheService.ts
import Redis from 'ioredis';
import { compress, decompress } from 'lz-string';

export class RedisCacheService {
    private client: Redis;
    private readonly TTL = 3600; // 1 hour

    constructor() {
        this.client = new Redis(process.env.REDIS_URL);
    }

    async set(key: string, data: any): Promise<void> {
        const compressed = compress(JSON.stringify(data));
        await this.client.setex(key, this.TTL, compressed);
    }

    async get(key: string): Promise<any> {
        const compressed = await this.client.get(key);
        if (!compressed) return null;
        return JSON.parse(decompress(compressed));
    }
}