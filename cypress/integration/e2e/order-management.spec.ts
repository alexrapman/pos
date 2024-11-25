// cypress/integration/e2e/order-management.spec.ts
describe('Order Management E2E', () => {
  beforeEach(() => {
    cy.login('waiter@test.com', 'password');
  });

  it('should complete full order flow', () => {
    // Create new order
    cy.visit('/tables');
    cy.get('[data-cy=table-1]').click();
    cy.get('[data-cy=new-order]').click();

    // Add items to order
    cy.get('[data-cy=menu-category-main]').click();
    cy.get('[data-cy=menu-item-pizza]').click();
    cy.get('[data-cy=quantity-increase]').click();
    cy.get('[data-cy=add-to-order]').click();

    // Submit order
    cy.get('[data-cy=submit-order]').click();
    cy.get('[data-cy=order-success]').should('be.visible');

    // Kitchen view
    cy.loginAs('kitchen');
    cy.get('[data-cy=new-orders]')
      .should('contain', 'Table 1')
      .and('contain', 'Pizza x2');
    cy.get('[data-cy=start-preparing]').click();
    cy.get('[data-cy=mark-ready]').click();

    // Payment process
    cy.loginAs('waiter');
    cy.visit('/orders');
    cy.get('[data-cy=order-ready]').should('be.visible');
    cy.get('[data-cy=process-payment]').click();

    // Handle payment
    cy.get('[data-cy=payment-amount]').should('contain', '25.98');
    cy.get('[data-cy=payment-cash]').click();
    cy.get('[data-cy=cash-received]').type('30');
    cy.get('[data-cy=complete-payment]').click();

    // Verify completion
    cy.get('[data-cy=payment-success]').should('be.visible');
    cy.get('[data-cy=print-receipt]').should('be.visible');
  });

  it('should handle order modifications', () => {
    cy.createOrder('Table 1', ['Pizza']);
    cy.visit('/orders');
    
    // Modify order
    cy.get('[data-cy=modify-order]').click();
    cy.get('[data-cy=add-item]').click();
    cy.get('[data-cy=menu-item-cola]').click();
    cy.get('[data-cy=update-order]').click();

    // Verify update
    cy.get('[data-cy=order-items]')
      .should('contain', 'Pizza')
      .and('contain', 'Cola');
  });

  it('should handle order cancellation', () => {
    cy.createOrder('Table 1', ['Pizza']);
    cy.visit('/orders');
    
    // Cancel order
    cy.get('[data-cy=cancel-order]').click();
    cy.get('[data-cy=confirm-cancel]').click();

    // Verify cancellation
    cy.get('[data-cy=cancelled-banner]').should('be.visible');
    cy.get('[data-cy=refund-amount]').should('contain', '12.99');
  });
});