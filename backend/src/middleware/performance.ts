// backend/src/middleware/performance.ts
import { Request, Response, NextFunction } from 'express';
import { promisify } from 'util';
import { cpuUsage, memoryUsage } from 'process';
import { Gauge, Counter, Histogram } from 'prom-client';

// Initialize metrics
const responseTime = new Histogram({
  name: 'http_response_time_seconds',
  help: 'Response time in seconds',
  labelNames: ['method', 'route', 'status']
});

const requestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const memoryUsageGauge = new Gauge({
  name: 'node_memory_usage_bytes',
  help: 'Node.js memory usage'
});

export const performanceMonitoring = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const start = process.hrtime();

  // Track memory
  const trackMemory = () => {
    const used = memoryUsage();
    memoryUsageGauge.set(used.heapUsed);
  };

  // Track response
  res.on('finish', () => {
    const elapsed = process.hrtime(start);
    const duration = elapsed[0] + elapsed[1] / 1e9;

    const labels = {
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode.toString()
    };

    responseTime.observe(labels, duration);
    requestsTotal.inc(labels);
    trackMemory();
  });

  next();
};

// Health check endpoint
export const healthCheck = async (
  req: Request, 
  res: Response
) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  };

  try {
    res.send(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).send();
  }
};