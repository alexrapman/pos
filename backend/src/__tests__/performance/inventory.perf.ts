// backend/src/__tests__/performance/inventory.perf.ts
import autocannon from 'autocannon';
import { app } from '../../server';
import http from 'http';

describe('Inventory Performance Tests', () => {
  let server: http.Server;
  const PORT = 3001;

  beforeAll((done) => {
    server = app.listen(PORT, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('debería manejar múltiples actualizaciones de stock', async () => {
    const result = await autocannon({
      url: `http://localhost:${PORT}/api/inventory/stock/update`,
      connections: 10,
      duration: 10,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      requests: [
        {
          method: 'POST',
          body: JSON.stringify({
            productId: 1,
            quantity: 1,
            type: 'out',
            reason: 'Performance test'
          })
        }
      ]
    });

    expect(result.errors).toBe(0);
    expect(result.timeouts).toBe(0);
    expect(result.latency.p99).toBeLessThan(1000); // 1 segundo máximo
  });

  it('debería manejar consultas concurrentes de inventario', async () => {
    const result = await autocannon({
      url: `http://localhost:${PORT}/api/inventory/products`,
      connections: 50,
      duration: 10,
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });

    expect(result.errors).toBe(0);
    expect(result.timeouts).toBe(0);
    expect(result.latency.average).toBeLessThan(100); // 100ms promedio
  });
});