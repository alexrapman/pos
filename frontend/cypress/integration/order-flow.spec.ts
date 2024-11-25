// frontend/cypress/integration/order-flow.spec.ts
describe('Order Flow', () => {
  beforeEach(() => {
    cy.login('waiter', 'password');
  });

  it('should create and track order status', () => {
    // Create new order
    cy.visit('/orders/new');
    cy.get('[data-cy=table-number]').type('5');
    cy.get('[data-cy=product-Pizza]').click();
    cy.get('[data-cy=create-order]').click();

    // Verify order appears in list
    cy.visit('/orders');
    cy.get('[data-cy=order-card]').should('contain', 'Table 5');
    cy.get('[data-cy=order-status]').should('contain', 'pending');

    // Kitchen updates status
    cy.loginAsKitchen();
    cy.visit('/kitchen');
    cy.get('[data-cy=start-preparing]').click();
    
    // Verify status update in waiter view
    cy.loginAsWaiter();
    cy.visit('/orders');
    cy.get('[data-cy=order-status]').should('contain', 'preparing');
  });

  it('should handle real-time updates', () => {
    cy.visit('/orders');
    
    // Simulate WebSocket event
    cy.window().then((win) => {
      win.socketService.emit('orderUpdate', {
        orderId: 1,
        status: 'ready'
      });
    });

    cy.get('[data-cy=order-status]')
      .should('contain', 'ready');
  });
});