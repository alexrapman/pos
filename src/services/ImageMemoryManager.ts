// src/services/ImageMemoryManager.ts
import { EventEmitter } from 'events';

interface MemoryUsage {
    total: number;
    free: number;
    used: number;
}

export class ImageMemoryManager extends EventEmitter {
    private readonly maxMemoryUsage = 512 * 1024 * 1024; // 512MB
    private cachedImages: Map<string, ArrayBuffer> = new Map();
    private memoryUsage: number = 0;

    async addImage(key: string, imageData: ArrayBuffer): Promise<void> {
        const imageSize = imageData.byteLength;

        if (this.memoryUsage + imageSize > this.maxMemoryUsage) {
            await this.cleanupMemory(imageSize);
        }

        this.cachedImages.set(key, imageData);
        this.memoryUsage += imageSize;
        this.emit('memoryUpdate', this.getMemoryStats());
    }

    private async cleanupMemory(requiredSize: number): Promise<void> {
        const entries = Array.from(this.cachedImages.entries());
        entries.sort((a, b) => a[1].byteLength - b[1].byteLength);

        while (this.memoryUsage + requiredSize > this.maxMemoryUsage && entries.length > 0) {
            const [key, data] = entries.shift()!;
            this.cachedImages.delete(key);
            this.memoryUsage -= data.byteLength;
        }

        this.emit('cleanup', this.getMemoryStats());
    }

    private getMemoryStats(): MemoryUsage {
        return {
            total: this.maxMemoryUsage,
            used: this.memoryUsage,
            free: this.maxMemoryUsage - this.memoryUsage
        };
    }

    getImage(key: string): ArrayBuffer | undefined {
        return this.cachedImages.get(key);
    }
}