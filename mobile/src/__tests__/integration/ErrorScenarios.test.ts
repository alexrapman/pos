// mobile/src/__tests__/integration/ErrorScenarios.test.ts
import { DataSyncManager } from '../../services/DataSyncManager';
import { NetworkManager } from '../../services/NetworkManager';
import { PersistenceManager } from '../../services/PersistenceManager';

describe('Error Scenario Tests', () => {
  let syncManager: DataSyncManager;
  let networkManager: NetworkManager;
  let persistenceManager: PersistenceManager;

  beforeEach(() => {
    jest.useFakeTimers();
    networkManager = NetworkManager.getInstance();
    persistenceManager = PersistenceManager.getInstance();
    syncManager = DataSyncManager.getInstance();
  });

  afterEach(async () => {
    await persistenceManager.clearData();
    jest.useRealTimers();
  });

  describe('Network Failures', () => {
    it('should retry failed operations with exponential backoff', async () => {
      const mockFetch = jest.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: 1 }) });

      global.fetch = mockFetch;

      await syncManager.queueOperation('/api/orders', 'POST', { id: 1 });
      
      // First attempt
      await syncManager.processQueue();
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Second attempt after delay
      jest.advanceTimersByTime(2000);
      await syncManager.processQueue();
      expect(mockFetch).toHaveBeenCalledTimes(2);

      // Third attempt successful
      jest.advanceTimersByTime(4000);
      await syncManager.processQueue();
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should handle timeout scenarios', async () => {
      jest.spyOn(networkManager, 'checkConnection').mockResolvedValue(true);

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );

      global.fetch = jest.fn().mockImplementation(() => timeoutPromise);

      await syncManager.queueOperation('/api/orders', 'POST', { id: 1 });
      
      jest.advanceTimersByTime(6000);
      
      const queue = await persistenceManager.getData('syncQueue');
      expect(queue).toHaveLength(1);
      expect(queue[0].retryCount).toBe(1);
    });
  });

  describe('Data Corruption', () => {
    it('should handle corrupted local data', async () => {
      // Save corrupted data
      await persistenceManager.saveData('orders_1', '{"corrupt": true, incomplete json');

      const result = await persistenceManager.getData('orders_1');
      expect(result).toBeNull();

      // Verify error was logged
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle invalid server responses', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      });

      await syncManager.queueOperation('/api/orders', 'POST', { id: 1 });
      await syncManager.processQueue();

      const queue = await persistenceManager.getData('syncQueue');
      expect(queue[0].retryCount).toBe(1);
    });
  });
});