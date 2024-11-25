// tests/system/functionalityTest.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function testSystemFunctionality() {
  try {
    // Test authentication
    const authResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'password'
    });
    console.log('Auth test:', authResponse.status === 200 ? 'PASS' : 'FAIL');

    // Test basic endpoints
    const endpoints = [
      '/api/tables',
      '/api/menu',
      '/api/orders'
    ];

    for (const endpoint of endpoints) {
      const response = await axios.get(`${BASE_URL}${endpoint}`);
      console.log(`${endpoint} test:`, response.status === 200 ? 'PASS' : 'FAIL');
    }

  } catch (error) {
    console.error('System test failed:', error.message);
  }
}

testSystemFunctionality();