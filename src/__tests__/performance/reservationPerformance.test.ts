// src/__tests__/performance/reservationPerformance.test.ts
import { performance } from 'perf_hooks';
import autocannon from 'autocannon';
import { app } from '../../app';
import http from 'http';

describe('Reservation System Performance', () => {
  let server: http.Server;

  beforeAll((done) => {
    server = app.listen(3001, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should handle multiple concurrent reservation requests', async () => {
    const result = await autocannon({
      url: 'http://localhost:3001/api/reservations',
      connections: 10,
      pipelining: 1,
      duration: 10,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '1234567890',
        tableId: 1,
        partySize: 2,
        duration: 2,
        date: new Date(Date.now() + 86400000).toISOString()
      })
    });

    expect(result.errors).toBe(0);
    expect(result.timeouts).toBe(0);
    expect(result.non2xx).toBe(0);
    expect(result.latency.p99).toBeLessThan(1000); // 99th percentile under 1s
  });

  it('should maintain performance under load', async () => {
    const startTime = performance.now();
    const requests = Array(100).fill(null).map((_, index) => 
      fetch('http://localhost:3001/api/reservations', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
    );

    await Promise.all(requests);
    const duration = performance.now() - startTime;
    
    expect(duration).toBeLessThan(5000); // Should complete in under 5s
  });
});