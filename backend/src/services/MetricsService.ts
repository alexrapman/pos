// backend/src/services/MetricsService.ts
import { EventEmitter } from 'events';
import os from 'os';
import { Server } from 'socket.io';
import { promisify } from 'util';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

export class MetricsService extends EventEmitter {
  private io: Server;
  private metricsInterval: NodeJS.Timeout;
  private influx: InfluxDB;

  constructor(io: Server) {
    super();
    this.io = io;
    this.influx = new InfluxDB({
      url: process.env.INFLUXDB_URL || 'http://localhost:8086',
      token: process.env.INFLUXDB_TOKEN
    });

    this.startMetricsCollection();
  }

  private startMetricsCollection() {
    this.metricsInterval = setInterval(async () => {
      const metrics = await this.collectMetrics();
      this.io.emit('metrics', metrics);
      await this.saveMetrics(metrics);
    }, 1000);
  }

  private async collectMetrics() {
    const cpuUsage = os.loadavg()[0];
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;

    return {
      timestamp: Date.now(),
      metrics: {
        cpu: cpuUsage,
        memory: memoryUsage,
        requests: global.requestCount || 0,
        responseTime: global.responseTimeAvg || 0
      }
    };
  }

  private async saveMetrics(metrics: any) {
    const writeApi = this.influx.getWriteApi(
      process.env.INFLUXDB_ORG || 'myorg',
      process.env.INFLUXDB_BUCKET || 'metrics'
    );

    const point = new Point('system_metrics')
      .floatField('cpu', metrics.metrics.cpu)
      .floatField('memory', metrics.metrics.memory)
      .intField('requests', metrics.metrics.requests)
      .floatField('responseTime', metrics.metrics.responseTime);

    try {
      await writeApi.writePoint(point);
      await writeApi.flush();
    } catch (error) {
      console.error('Error saving metrics:', error);
    }
  }

  public stop() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
  }
}