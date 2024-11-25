// backend/src/monitoring/alerts.ts
import { EventEmitter } from 'events';
import nodemailer from 'nodemailer';
import { register } from './metrics';

export class AlertService extends EventEmitter {
  private thresholds = {
    errorRate: 0.1,
    responseTime: 500,
    cpuUsage: 80,
    memoryUsage: 85
  };

  private mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  constructor() {
    super();
    this.initializeMonitors();
  }

  private initializeMonitors() {
    setInterval(async () => {
      const metrics = await register.getMetricsAsJSON();
      this.checkMetrics(metrics);
    }, 60000);
  }

  private async checkMetrics(metrics: any) {
    // Error Rate Check
    const errorRate = this.calculateErrorRate(metrics);
    if (errorRate > this.thresholds.errorRate) {
      this.triggerAlert('High Error Rate', `Current error rate: ${errorRate}%`);
    }

    // Response Time Check
    const avgResponseTime = this.calculateAvgResponseTime(metrics);
    if (avgResponseTime > this.thresholds.responseTime) {
      this.triggerAlert('Slow Response Time', `Average response time: ${avgResponseTime}ms`);
    }
  }

  private async triggerAlert(title: string, message: string) {
    const alert = {
      timestamp: new Date(),
      title,
      message
    };

    this.emit('alert', alert);

    await this.mailer.sendMail({
      from: process.env.ALERT_FROM,
      to: process.env.ALERT_TO,
      subject: `[ALERT] ${title}`,
      text: message
    });
  }
}