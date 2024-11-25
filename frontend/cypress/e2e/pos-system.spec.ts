// frontend/cypress/e2e/pos-system.spec.ts
describe('POS System E2E Tests', () => {
  beforeEach(() => {
    cy.task('db:seed');
  });

  describe('Authentication', () => {
    it('should login with different roles', () => {
      cy.visit('/login');
      
      // Test waiter login
      cy.get('[data-cy=username]').type('waiter@test.com');
      cy.get('[data-cy=password]').type('password123');
      cy.get('[data-cy=login-button]').click();
      cy.url().should('include', '/orders');
      cy.get('[data-cy=user-role]').should('contain', 'Waiter');
      cy.logout();

      // Test kitchen login
      cy.get('[data-cy=username]').type('kitchen@test.com');
      cy.get('[data-cy=password]').type('password123');
      cy.get('[data-cy=login-button]').click();
      cy.url().should('include', '/kitchen');
    });
  });

  describe('Order Management', () => {
    beforeEach(() => cy.login('waiter', 'password123'));

    it('should create and process order', () => {
      cy.visit('/orders/new');
      
      // Create order
      cy.get('[data-cy=table-select]').select('5');
      cy.get('[data-cy=menu-item-pizza]').click();
      cy.get('[data-cy=menu-item-cola]').click();
      cy.get('[data-cy=create-order]').click();

      // Verify order created
      cy.get('[data-cy=order-notification]')
        .should('contain', 'Order created successfully');
      
      // Kitchen view
      cy.loginAs('kitchen');
      cy.visit('/kitchen');
      cy.get('[data-cy=order-card]')
        .should('contain', 'Table 5')
        .should('contain', 'Pizza')
        .should('contain', 'Cola');
      
      // Process order
      cy.get('[data-cy=start-preparing]').click();
      cy.get('[data-cy=mark-ready]').click();

      // Waiter view
      cy.loginAs('waiter');
      cy.visit('/orders');
      cy.get('[data-cy=order-status]').should('contain', 'ready');
      cy.get('[data-cy=mark-delivered]').click();
    });
  });

  describe('Payment Process', () => {
    beforeEach(() => cy.login('waiter', 'password123'));

    it('should process payment and generate receipt', () => {
      cy.createOrder(5, ['Pizza', 'Cola']);
      cy.visit('/orders');
      
      // Process payment
      cy.get('[data-cy=process-payment]').click();
      cy.get('[data-cy=payment-amount]').should('contain', '15.00');
      cy.get('[data-cy=payment-cash]').click();
      cy.get('[data-cy=cash-received]').type('20');
      cy.get('[data-cy=complete-payment]').click();

      // Verify receipt
      cy.get('[data-cy=receipt]').should('exist');
      cy.get('[data-cy=receipt]').should('contain', 'Table 5');
      cy.get('[data-cy=receipt]').should('contain', 'Total: $15.00');
      cy.get('[data-cy=receipt]').should('contain', 'Change: $5.00');
    });
  });
});