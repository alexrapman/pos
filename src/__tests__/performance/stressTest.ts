// src/__tests__/performance/stressTest.ts
import autocannon, { Result } from 'autocannon';
import { app } from '../../app';
import http from 'http';
import { Monitor } from './Monitor';

class StressTest {
  private server: http.Server;
  private monitor: Monitor;

  async setup() {
    this.server = app.listen(3001);
    this.monitor = new Monitor();
  }

  async runStressTest(): Promise<Result> {
    this.monitor.start();

    const result = await autocannon({
      url: 'http://localhost:3001/api/reservations',
      connections: 100,
      duration: 30,
      amount: 10000,
      requests: [
        {
          method: 'POST',
          path: '/api/reservations',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: 'Stress Test',
            customerEmail: 'stress@test.com',
            customerPhone: '1234567890',
            tableId: 1,
            partySize: 2,
            duration: 2,
            date: new Date(Date.now() + 86400000).toISOString()
          })
        },
        {
          method: 'GET',
          path: '/api/reservations'
        }
      ],
      workers: 8
    });

    const metrics = this.monitor.stop();

    return {
      ...result,
      systemMetrics: metrics
    };
  }

  async cleanup() {
    await new Promise(resolve => this.server.close(resolve));
  }
}

describe('Reservation System Stress Test', () => {
  let stressTest: StressTest;

  beforeAll(async () => {
    stressTest = new StressTest();
    await stressTest.setup();
  });

  afterAll(async () => {
    await stressTest.cleanup();
  });

  it('should handle sustained heavy load', async () => {
    const result = await stressTest.runStressTest();

    expect(result.errors).toBeLessThan(result.requests.total * 0.01); // Less than 1% errors
    expect(result.timeouts).toBeLessThan(result.requests.total * 0.01);
    expect(result.systemMetrics.memory.heapUsed).toBeLessThan(1024 * 1024 * 512); // < 512MB
    expect(result.systemMetrics.cpu.usage).toBeLessThan(80); // < 80% CPU
  });
});