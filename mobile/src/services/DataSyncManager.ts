// mobile/src/services/DataSyncManager.ts
import { PersistenceManager } from './PersistenceManager';
import { NetworkManager } from './NetworkManager';
import { ErrorLoggingService } from './ErrorLoggingService';

interface SyncOperation {
  id: string;
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  data: any;
  timestamp: number;
  retryCount: number;
}

export class DataSyncManager {
  private static instance: DataSyncManager;
  private syncQueue: SyncOperation[] = [];
  private isProcessing: boolean = false;
  private maxRetries: number = 3;
  private persistence: PersistenceManager;
  private network: NetworkManager;
  private logger: ErrorLoggingService;

  private constructor() {
    this.persistence = PersistenceManager.getInstance();
    this.network = NetworkManager.getInstance();
    this.logger = ErrorLoggingService.getInstance();
    this.loadQueue();
    this.startQueueProcessor();
  }

  static getInstance(): DataSyncManager {
    if (!this.instance) {
      this.instance = new DataSyncManager();
    }
    return this.instance;
  }

  async queueOperation(
    endpoint: string,
    method: SyncOperation['method'],
    data: any
  ): Promise<void> {
    const operation: SyncOperation = {
      id: crypto.randomUUID(),
      endpoint,
      method,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };

    this.syncQueue.push(operation);
    await this.saveQueue();
    this.processQueue();
  }

  private async loadQueue(): Promise<void> {
    const queue = await this.persistence.getData<SyncOperation[]>('syncQueue');
    if (queue) {
      this.syncQueue = queue;
    }
  }

  private async saveQueue(): Promise<void> {
    await this.persistence.saveData('syncQueue', this.syncQueue);
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || !this.network.checkConnection()) return;

    this.isProcessing = true;

    try {
      while (this.syncQueue.length > 0) {
        const operation = this.syncQueue[0];
        
        try {
          await this.performOperation(operation);
          this.syncQueue.shift();
        } catch (error) {
          if (operation.retryCount >= this.maxRetries) {
            this.syncQueue.shift();
            await this.logger.logError(error as Error, {
              context: 'sync_failed',
              operation
            });
          } else {
            operation.retryCount++;
          }
        }

        await this.saveQueue();
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async performOperation(operation: SyncOperation): Promise<void> {
    const response = await fetch(operation.endpoint, {
      method: operation.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(operation.data)
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }

    const responseData = await response.json();
    await this.persistence.saveData(
      `${operation.endpoint}_${operation.data.id}`,
      responseData
    );
  }

  private startQueueProcessor(): void {
    setInterval(() => {
      if (!this.isProcessing) {
        this.processQueue();
      }
    }, 30000); // Check every 30 seconds
  }
}