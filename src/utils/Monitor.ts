// src/__tests__/performance/Monitor.ts
import { cpus, totalmem, freemem } from 'os';
import { EventEmitter } from 'events';

interface SystemMetrics {
  timestamp: number;
  memory: {
    total: number;
    free: number;
    used: number;
    heapUsed: number;
    heapTotal: number;
  };
  cpu: {
    usage: number;
    loadAverage: number[];
  };
}

export class Monitor extends EventEmitter {
  private interval: NodeJS.Timeout | null = null;
  private metrics: SystemMetrics[] = [];
  private readonly SAMPLE_INTERVAL = 1000; // 1 second

  start(): void {
    this.metrics = [];
    this.interval = setInterval(() => {
      const metric = this.collectMetrics();
      this.metrics.push(metric);
      this.emit('metric', metric);
    }, this.SAMPLE_INTERVAL);
  }

  stop(): SystemMetrics[] {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    return this.metrics;
  }

  private collectMetrics(): SystemMetrics {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = this.calculateCPUUsage();

    return {
      timestamp: Date.now(),
      memory: {
        total: totalmem(),
        free: freemem(),
        used: totalmem() - freemem(),
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal
      },
      cpu: {
        usage: cpuUsage,
        loadAverage: cpus().map(cpu => cpu.times.user / cpu.times.idle * 100)
      }
    };
  }

  private calculateCPUUsage(): number {
    const cpuInfo = cpus();
    const totalIdle = cpuInfo.reduce((acc, cpu) => acc + cpu.times.idle, 0);
    const totalTick = cpuInfo.reduce((acc, cpu) => 
      acc + Object.values(cpu.times).reduce((sum, time) => sum + time, 0), 0
    );
    return ((totalTick - totalIdle) / totalTick) * 100;
  }

  getAverageMetrics(): SystemMetrics {
    if (this.metrics.length === 0) {
      throw new Error('No metrics collected');
    }

    return {
      timestamp: Date.now(),
      memory: {
        total: this.metrics[0].memory.total,
        free: this.average(this.metrics.map(m => m.memory.free)),
        used: this.average(this.metrics.map(m => m.memory.used)),
        heapUsed: this.average(this.metrics.map(m => m.memory.heapUsed)),
        heapTotal: this.average(this.metrics.map(m => m.memory.heapTotal))
      },
      cpu: {
        usage: this.average(this.metrics.map(m => m.cpu.usage)),
        loadAverage: this.metrics[0].cpu.loadAverage.map((_, i) => 
          this.average(this.metrics.map(m => m.cpu.loadAverage[i]))
        )
      }
    };
  }

  private average(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }
}