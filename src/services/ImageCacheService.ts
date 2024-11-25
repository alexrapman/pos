// src/services/ImageCacheService.ts
import { promises as fs } from 'fs';
import path from 'path';

export class ImageCacheService {
    private readonly cacheDir: string;
    private readonly maxCacheSize: number = 100 * 1024 * 1024; // 100MB
    private cacheMap: Map<string, string> = new Map();

    constructor() {
        this.cacheDir = path.join(process.env.APPDATA!, 'RestaurantPOS', 'image-cache');
        this.initializeCache();
    }

    private async initializeCache(): Promise<void> {
        try {
            await fs.mkdir(this.cacheDir, { recursive: true });
            await this.loadExistingCache();
            await this.cleanupCache();
        } catch (error) {
            console.error('Error inicializando caché:', error);
        }
    }

    private async loadExistingCache(): Promise<void> {
        const files = await fs.readdir(this.cacheDir);
        for (const file of files) {
            const filePath = path.join(this.cacheDir, file);
            const stats = await fs.stat(filePath);
            this.cacheMap.set(file, filePath);
        }
    }

    private async cleanupCache(): Promise<void> {
        let totalSize = 0;
        const cacheEntries = [];

        for (const [key, filePath] of this.cacheMap.entries()) {
            const stats = await fs.stat(filePath);
            totalSize += stats.size;
            cacheEntries.push({ key, size: stats.size, accessed: stats.atime });
        }

        if (totalSize > this.maxCacheSize) {
            cacheEntries.sort((a, b) => a.accessed.getTime() - b.accessed.getTime());

            while (totalSize > this.maxCacheSize && cacheEntries.length > 0) {
                const entry = cacheEntries.shift()!;
                await this.removeFromCache(entry.key);
                totalSize -= entry.size;
            }
        }
    }

    private async removeFromCache(key: string): Promise<void> {
        const filePath = this.cacheMap.get(key);
        if (filePath) {
            await fs.unlink(filePath);
            this.cacheMap.delete(key);
        }
    }
}