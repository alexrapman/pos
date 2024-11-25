// mobile/src/services/ConflictResolver.ts
import { PersistenceManager } from './PersistenceManager';

interface ConflictResolutionStrategy {
  serverWins: boolean;
  mergeFields?: string[];
  customResolver?: (local: any, server: any) => any;
}

export class ConflictResolver {
  private persistence: PersistenceManager;

  constructor() {
    this.persistence = PersistenceManager.getInstance();
  }

  async resolveConflict(
    entityType: string,
    localData: any,
    serverData: any,
    strategy: ConflictResolutionStrategy
  ): Promise<any> {
    if (strategy.customResolver) {
      return strategy.customResolver(localData, serverData);
    }

    if (strategy.serverWins) {
      await this.persistence.saveData(
        `${entityType}_${localData.id}`,
        serverData
      );
      return serverData;
    }

    if (strategy.mergeFields) {
      const merged = { ...localData };
      for (const field of strategy.mergeFields) {
        if (serverData[field] !== undefined) {
          merged[field] = serverData[field];
        }
      }
      await this.persistence.saveData(
        `${entityType}_${localData.id}`,
        merged
      );
      return merged;
    }

    return localData;
  }

  async detectConflicts(
    entityType: string,
    localData: any[],
    serverData: any[]
  ): Promise<any[]> {
    const conflicts = [];

    for (const localItem of localData) {
      const serverItem = serverData.find(i => i.id === localItem.id);
      if (serverItem && this.hasConflict(localItem, serverItem)) {
        conflicts.push({
          local: localItem,
          server: serverItem,
          type: entityType
        });
      }
    }

    return conflicts;
  }

  private hasConflict(local: any, server: any): boolean {
    const localVersion = local.version || 0;
    const serverVersion = server.version || 0;
    
    if (localVersion !== serverVersion) {
      return true;
    }

    const localHash = this.generateHash(local);
    const serverHash = this.generateHash(server);
    
    return localHash !== serverHash;
  }

  private generateHash(data: any): string {
    return JSON.stringify(data)
      .split('')
      .reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0)
      .toString();
  }
}