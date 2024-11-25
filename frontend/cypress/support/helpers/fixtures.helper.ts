// frontend/cypress/support/helpers/fixtures.helper.ts
export const loadFixtures = {
    async loadTestData() {
      cy.fixture('users.json').as('users');
      cy.fixture('products.json').as('products');
      cy.fixture('orders.json').as('orders');
    },
  
    getTestOrder() {
      return cy.get('@orders').then(fixtures => fixtures.sampleOrders[0]);
    },
  
    getTestUser(role: 'admin' | 'waiter' | 'kitchen') {
      return cy.get('@users').then(fixtures => fixtures[role]);
    }
  };