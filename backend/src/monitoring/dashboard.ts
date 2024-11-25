// backend/src/monitoring/dashboard.ts
import { Router } from 'express';
import { register } from './metrics';
import { authMiddleware, checkRole } from '../middleware/auth';

const router = Router();

router.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// grafana-dashboard.json
{
  "annotations": {
    "list": []
  },
  "editable": true,
  "panels": [
    {
      "title": "Request Duration",
      "type": "graph",
      "datasource": "Prometheus",
      "targets": [
        {
          "expr": "rate(http_request_duration_seconds_sum[5m])",
          "legendFormat": "{{method}} {{route}}"
        }
      ]
    },
    {
      "title": "Request Count",
      "type": "stat",
      "datasource": "Prometheus",
      "targets": [
        {
          "expr": "sum(increase(http_requests_total[24h]))"
        }
      ]
    },
    {
      "title": "Error Rate",
      "type": "gauge",
      "datasource": "Prometheus",
      "targets": [
        {
          "expr": "sum(rate(http_requests_total{status_code=~\"5.*\"}[5m])) / sum(rate(http_requests_total[5m])) * 100"
        }
      ]
    }
  ]
}