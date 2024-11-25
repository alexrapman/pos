// mobile/src/services/ConflictResolutionStrategies.ts
export enum MergePolicy {
  SERVER_WINS = 'SERVER_WINS',
  CLIENT_WINS = 'CLIENT_WINS',
  LATEST_WINS = 'LATEST_WINS',
  MERGE_FIELDS = 'MERGE_FIELDS'
}

export abstract class ConflictStrategy {
  abstract resolve(local: any, server: any): Promise<any>;
}

export class ServerWinsStrategy extends ConflictStrategy {
  async resolve(local: any, server: any): Promise<any> {
    return { ...server, syncedAt: new Date().toISOString() };
  }
}

export class ClientWinsStrategy extends ConflictStrategy {
  async resolve(local: any, server: any): Promise<any> {
    return { ...local, syncedAt: new Date().toISOString() };
  }
}

export class LatestWinsStrategy extends ConflictStrategy {
  async resolve(local: any, server: any): Promise<any> {
    const localTimestamp = new Date(local.updatedAt).getTime();
    const serverTimestamp = new Date(server.updatedAt).getTime();
    
    return {
      ...(localTimestamp > serverTimestamp ? local : server),
      syncedAt: new Date().toISOString()
    };
  }
}

export class FieldMergeStrategy extends ConflictStrategy {
  constructor(private fields: string[]) {
    super();
  }

  async resolve(local: any, server: any): Promise<any> {
    const result = { ...local };
    
    for (const field of this.fields) {
      if (this.isFieldNewer(server[field], local[field])) {
        result[field] = server[field];
      }
    }

    return {
      ...result,
      syncedAt: new Date().toISOString()
    };
  }

  private isFieldNewer(serverValue: any, localValue: any): boolean {
    if (!serverValue || !localValue) return !!serverValue;
    
    const serverTimestamp = new Date(serverValue.updatedAt || 0).getTime();
    const localTimestamp = new Date(localValue.updatedAt || 0).getTime();
    
    return serverTimestamp > localTimestamp;
  }
}