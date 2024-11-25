// mobile/src/services/PersistenceManager.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createHash } from 'crypto';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
  hash: string;
}

export class PersistenceManager {
  private static instance: PersistenceManager;
  private cacheExpiration = 24 * 60 * 60 * 1000; // 24 hours

  static getInstance(): PersistenceManager {
    if (!this.instance) {
      this.instance = new PersistenceManager();
    }
    return this.instance;
  }

  async saveData<T>(key: string, data: T, version: string = '1.0'): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      version,
      hash: this.generateHash(data)
    };

    try {
      await AsyncStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.error(`Failed to save data for key ${key}:`, error);
      throw error;
    }
  }

  async getData<T>(key: string, version?: string): Promise<T | null> {
    try {
      const stored = await AsyncStorage.getItem(key);
      if (!stored) return null;

      const entry: CacheEntry<T> = JSON.parse(stored);

      // Version check
      if (version && entry.version !== version) {
        await this.removeData(key);
        return null;
      }

      // Expiration check
      if (Date.now() - entry.timestamp > this.cacheExpiration) {
        await this.removeData(key);
        return null;
      }

      // Hash validation
      if (this.generateHash(entry.data) !== entry.hash) {
        await this.removeData(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error(`Failed to retrieve data for key ${key}:`, error);
      return null;
    }
  }

  async removeData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove data for key ${key}:`, error);
      throw error;
    }
  }

  private generateHash(data: any): string {
    return createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  async clearExpiredData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      for (const key of keys) {
        await this.getData(key);
      }
    } catch (error) {
      console.error('Failed to clear expired data:', error);
    }
  }
}