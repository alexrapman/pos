// mobile/src/__tests__/integration/DataSync.test.ts
import { DataSyncManager } from '../../services/DataSyncManager';
import { NetworkManager } from '../../services/NetworkManager';
import { PersistenceManager } from '../../services/PersistenceManager';
import { ConflictStrategyFactory, MergePolicy } from '../../services/ConflictResolutionStrategies';

describe('Data Sync Integration Tests', () => {
  let syncManager: DataSyncManager;
  let networkManager: NetworkManager;
  let persistenceManager: PersistenceManager;

  beforeEach(() => {
    networkManager = NetworkManager.getInstance();
    persistenceManager = PersistenceManager.getInstance();
    syncManager = DataSyncManager.getInstance();
    ConflictStrategyFactory.initialize();
  });

  afterEach(async () => {
    await persistenceManager.clearData();
  });

  describe('Full Sync Cycle', () => {
    it('should handle offline modifications and sync when online', async () => {
      // Simulate offline state
      jest.spyOn(networkManager, 'checkConnection').mockResolvedValueOnce(false);

      const localOrder = {
        id: 1,
        items: ['item1'],
        total: 100,
        updatedAt: new Date().toISOString()
      };

      // Add offline modification
      await syncManager.queueOperation('/api/orders', 'POST', localOrder);
      
      // Verify queued operation
      const queue = await persistenceManager.getData('syncQueue');
      expect(queue).toHaveLength(1);

      // Simulate going online
      jest.spyOn(networkManager, 'checkConnection').mockResolvedValueOnce(true);

      // Mock server response
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          ...localOrder,
          status: 'confirmed'
        })
      });

      // Trigger sync
      await syncManager.processQueue();

      // Verify sync results
      const syncedOrder = await persistenceManager.getData('orders_1');
      expect(syncedOrder).toHaveProperty('status', 'confirmed');
    });

    it('should handle conflict resolution for concurrent modifications', async () => {
      const localProduct = {
        id: 1,
        name: 'Local Name',
        price: 100,
        updatedAt: '2024-01-01T00:00:00Z'
      };

      const serverProduct = {
        id: 1,
        name: 'Server Name',
        price: 200,
        updatedAt: '2024-01-02T00:00:00Z'
      };

      // Store local version
      await persistenceManager.saveData('products_1', localProduct);

      // Mock server response with conflict
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(serverProduct)
      });

      // Attempt sync
      await syncManager.queueOperation('/api/products', 'PUT', localProduct);

      // Verify resolution (should use server version as per strategy)
      const resolvedProduct = await persistenceManager.getData('products_1');
      expect(resolvedProduct.name).toBe('Server Name');
      expect(resolvedProduct.price).toBe(200);
    });
  });
});