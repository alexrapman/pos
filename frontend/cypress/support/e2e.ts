// frontend/cypress/support/e2e.ts
import './commands';
import { mount } from 'cypress/react18';

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      loginAs(role: 'admin' | 'waiter' | 'kitchen'): Chainable<void>;
      logout(): Chainable<void>;
      createOrder(tableNumber: number, items: string[]): Chainable<void>;
      mockWebSocket(): Chainable<void>;
      seedDatabase(): Chainable<void>;
    }
  }
}

// Prevent uncaught exceptions from failing tests
Cypress.on('uncaught:exception', () => false);

// Custom commands
Cypress.Commands.add('loginAs', (role) => {
  const credentials = {
    admin: { email: 'admin@test.com', password: 'password123' },
    waiter: { email: 'waiter@test.com', password: 'password123' },
    kitchen: { email: 'kitchen@test.com', password: 'password123' }
  };
  
  cy.login(credentials[role].email, credentials[role].password);
});

Cypress.Commands.add('seedDatabase', () => {
  cy.task('db:seed');
});

// Global beforeEach hook
beforeEach(() => {
  cy.intercept('POST', '/api/auth/login').as('login');
  cy.intercept('GET', '/api/orders*').as('getOrders');
  cy.intercept('POST', '/api/orders').as('createOrder');
});

// Global afterEach hook
afterEach(() => {
  cy.task('db:cleanup');
});