// mobile/src/__tests__/services/ConflictResolution.test.ts
import { 
  ConflictStrategyFactory,
  MergePolicy,
  ServerWinsStrategy,
  ClientWinsStrategy,
  LatestWinsStrategy,
  FieldMergeStrategy 
} from '../../services/ConflictResolutionStrategies';

describe('Conflict Resolution Tests', () => {
  beforeAll(() => {
    ConflictStrategyFactory.initialize();
  });

  describe('ServerWinsStrategy', () => {
    const strategy = new ServerWinsStrategy();

    it('should prefer server data', async () => {
      const local = { id: 1, name: 'Local', value: 100 };
      const server = { id: 1, name: 'Server', value: 200 };
      
      const result = await strategy.resolve(local, server);
      expect(result.name).toBe('Server');
      expect(result.value).toBe(200);
      expect(result.syncedAt).toBeDefined();
    });
  });

  describe('FieldMergeStrategy', () => {
    const strategy = new FieldMergeStrategy(['name', 'email']);

    it('should merge specified fields', async () => {
      const local = {
        id: 1,
        name: { value: 'Local', updatedAt: '2024-01-01' },
        email: { value: 'local@test.com', updatedAt: '2024-01-02' },
        phone: '123'
      };

      const server = {
        id: 1,
        name: { value: 'Server', updatedAt: '2024-01-02' },
        email: { value: 'server@test.com', updatedAt: '2024-01-01' },
        phone: '456'
      };

      const result = await strategy.resolve(local, server);
      expect(result.name.value).toBe('Server');
      expect(result.email.value).toBe('local@test.com');
      expect(result.phone).toBe('123');
    });
  });

  describe('ConflictStrategyFactory', () => {
    it('should return correct strategy for policy', () => {
      expect(ConflictStrategyFactory.getStrategy(MergePolicy.SERVER_WINS))
        .toBeInstanceOf(ServerWinsStrategy);
      
      expect(ConflictStrategyFactory.getStrategy(MergePolicy.LATEST_WINS))
        .toBeInstanceOf(LatestWinsStrategy);
      
      expect(ConflictStrategyFactory.getStrategy(MergePolicy.MERGE_FIELDS, ['name']))
        .toBeInstanceOf(FieldMergeStrategy);
    });

    it('should throw error for invalid policy', () => {
      expect(() => ConflictStrategyFactory.getStrategy('INVALID' as MergePolicy))
        .toThrow('No strategy found for policy: INVALID');
    });
  });
});