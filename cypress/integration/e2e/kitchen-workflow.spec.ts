// cypress/integration/e2e/kitchen-workflow.spec.ts
describe('Kitchen Workflow E2E', () => {
  beforeEach(() => {
    cy.login('kitchen@test.com', 'password');
    cy.visit('/kitchen');
  });

  it('should handle complete kitchen workflow', () => {
    // Create test orders
    cy.createOrders([
      {
        id: 1,
        tableId: 1,
        priority: 'high',
        items: [{ name: 'Pizza', quantity: 2 }]
      },
      {
        id: 2,
        tableId: 2,
        priority: 'normal',
        items: [{ name: 'Burger', quantity: 1 }]
      }
    ]);

    // Verify order queue
    cy.get('[data-cy=order-queue]')
      .should('contain', 'Table 1')
      .and('contain', 'Table 2');

    // Check priority sorting
    cy.get('[data-cy=order-list]').within(() => {
      cy.get('[data-cy=order-item]').first()
        .should('contain', 'Table 1')
        .and('have.class', 'priority-high');
    });

    // Start preparing order
    cy.get('[data-cy=order-1]').within(() => {
      cy.get('[data-cy=start-preparing]').click();
      cy.get('[data-cy=preparation-timer]').should('be.visible');
    });

    // Add cooking notes
    cy.get('[data-cy=cooking-notes]').type('Extra crispy');
    cy.get('[data-cy=save-notes]').click();

    // Mark items as ready
    cy.get('[data-cy=mark-item-ready]').click({ multiple: true });

    // Complete order
    cy.get('[data-cy=mark-order-ready]').click();
    cy.get('[data-cy=order-1]').should('have.class', 'status-ready');

    // Verify notifications
    cy.get('[data-cy=notifications]')
      .should('contain', 'Order #1 is ready');
  });
});