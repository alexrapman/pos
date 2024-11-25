// backend/src/services/CacheService.ts
import NodeCache from 'node-cache';

export class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 600, // 10 minutos
      checkperiod: 120
    });
  }

  set(key: string, data: any) {
    this.cache.set(key, data);
  }

  get(key: string) {
    return this.cache.get(key);
  }
}