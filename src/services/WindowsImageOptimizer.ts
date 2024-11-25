// src/services/WindowsImageOptimizer.ts
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

export class WindowsImageOptimizer {
    private readonly cacheDir: string;

    constructor() {
        this.cacheDir = path.join(process.env.APPDATA!, 'RestaurantPOS', 'image-cache');
        this.ensureCacheDir();
    }

    private async ensureCacheDir() {
        try {
            await fs.mkdir(this.cacheDir, { recursive: true });
        } catch (error) {
            console.error('Failed to create cache directory:', error);
        }
    }

    async optimizeImage(
        imagePath: string,
        dpiScale: number
    ): Promise<string> {
        const hash = await this.hashFile(imagePath);
        const cacheKey = `${hash}_${dpiScale}x`;
        const cachedPath = path.join(this.cacheDir, cacheKey);

        if (await this.existsInCache(cachedPath)) {
            return cachedPath;
        }

        const targetWidth = Math.ceil(256 * dpiScale); // Base size 256px

        await sharp(imagePath)
            .resize(targetWidth, targetWidth, {
                kernel: 'lanczos3',
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .toFile(cachedPath);

        return cachedPath;
    }

    private async hashFile(filePath: string): Promise<string> {
        const buffer = await fs.readFile(filePath);
        const crypto = require('crypto');
        return crypto.createHash('md5').update(buffer).digest('hex');
    }

    private async existsInCache(path: string): Promise<boolean> {
        try {
            await fs.access(path);
            return true;
        } catch {
            return false;
        }
    }
}