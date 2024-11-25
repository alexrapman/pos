// mobile/src/services/ConflictStrategyFactory.ts
import { 
  ConflictStrategy,
  ServerWinsStrategy,
  ClientWinsStrategy,
  LatestWinsStrategy,
  FieldMergeStrategy,
  MergePolicy
} from './ConflictResolutionStrategies';

export class ConflictStrategyFactory {
  private static strategies = new Map<string, ConflictStrategy>();

  static initialize() {
    this.strategies.set(MergePolicy.SERVER_WINS, new ServerWinsStrategy());
    this.strategies.set(MergePolicy.CLIENT_WINS, new ClientWinsStrategy());
    this.strategies.set(MergePolicy.LATEST_WINS, new LatestWinsStrategy());
  }

  static registerStrategy(key: string, strategy: ConflictStrategy) {
    this.strategies.set(key, strategy);
  }

  static getStrategy(policy: MergePolicy, fields?: string[]): ConflictStrategy {
    if (policy === MergePolicy.MERGE_FIELDS && fields) {
      return new FieldMergeStrategy(fields);
    }
    
    const strategy = this.strategies.get(policy);
    if (!strategy) {
      throw new Error(`No strategy found for policy: ${policy}`);
    }
    
    return strategy;
  }
}

// Usage example:
// mobile/src/services/DataSyncManager.ts - Updated

class DataSyncManager {
  private async resolveConflict(local: any, server: any, entity: string): Promise<any> {
    const strategyConfig = this.getStrategyConfig(entity);
    const strategy = ConflictStrategyFactory.getStrategy(
      strategyConfig.policy,
      strategyConfig.fields
    );
    
    return await strategy.resolve(local, server);
  }

  private getStrategyConfig(entity: string) {
    const configs = {
      'orders': {
        policy: MergePolicy.LATEST_WINS
      },
      'products': {
        policy: MergePolicy.SERVER_WINS
      },
      'customers': {
        policy: MergePolicy.MERGE_FIELDS,
        fields: ['name', 'email', 'preferences']
      }
    };

    return configs[entity] || { policy: MergePolicy.SERVER_WINS };
  }
}