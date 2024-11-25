// frontend/load-tests/order-flow.test.ts
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 10 }, // Ramp up
    { duration: '3m', target: 50 }, // Stay at peak load
    { duration: '1m', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% requests under 500ms
    errors: ['rate<0.1'],            // Error rate under 10%
  },
};

const BASE_URL = 'http://localhost:3001';

export default function() {
  // Login
  const loginRes = http.post(`${BASE_URL}/auth/login`, {
    email: 'waiter@test.com',
    password: 'password123'
  });

  check(loginRes, {
    'login successful': (r) => r.status === 200,
  }) || errorRate.add(1);

  const token = loginRes.json('token');

  // Create Order
  const orderRes = http.post(
    `${BASE_URL}/orders`,
    JSON.stringify({
      tableNumber: Math.floor(Math.random() * 20) + 1,
      items: [
        { productId: 1, quantity: 1 },
        { productId: 2, quantity: 2 }
      ]
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );

  check(orderRes, {
    'order created': (r) => r.status === 201,
  }) || errorRate.add(1);

  sleep(1);
}