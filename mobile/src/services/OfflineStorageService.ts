// mobile/src/services/OfflineStorageService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { v4 as uuidv4 } from 'uuid';

interface SyncItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  timestamp: number;
  synced: boolean;
}

export class OfflineStorageService {
  private syncQueue: SyncItem[] = [];
  private isOnline: boolean = true;

  constructor() {
    this.initializeNetworkListener();
    this.loadSyncQueue();
  }

  private async initializeNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;

      if (wasOffline && this.isOnline) {
        this.processSyncQueue();
      }
    });
  }

  private async loadSyncQueue() {
    try {
      const queue = await AsyncStorage.getItem('syncQueue');
      if (queue) {
        this.syncQueue = JSON.parse(queue);
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
    }
  }

  private async saveSyncQueue() {
    try {
      await AsyncStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }

  async addToSyncQueue(entity: string, action: SyncItem['action'], data: any) {
    const item: SyncItem = {
      id: uuidv4(),
      action,
      entity,
      data,
      timestamp: Date.now(),
      synced: false
    };

    this.syncQueue.push(item);
    await this.saveSyncQueue();

    if (this.isOnline) {
      await this.processSyncQueue();
    }
  }

  private async processSyncQueue() {
    for (const item of this.syncQueue) {
      if (item.synced) continue;

      try {
        await this.syncItem(item);
        item.synced = true;
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);
      }
    }

    await this.saveSyncQueue();
  }

  private async syncItem(item: SyncItem) {
    const endpoint = `${API_URL}/api/${item.entity}`;
    const method = {
      create: 'POST',
      update: 'PUT',
      delete: 'DELETE'
    }[item.action];

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item.data)
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }
  }
}