// cypress/integration/e2e/order-timing.spec.ts
describe('Order Timing and Efficiency', () => {
  beforeEach(() => {
    cy.login('kitchen@test.com', 'password');
    cy.visit('/kitchen/dashboard');
    cy.clock();
  });

  it('should track order preparation times', () => {
    // Create multiple test orders
    cy.createBatchOrders(5);

    // Monitor preparation flow
    cy.get('[data-cy=order-queue]').within(() => {
      // Start first order
      cy.get('[data-cy=order-1]').within(() => {
        cy.get('[data-cy=start-preparing]').click();
        cy.tick(300000); // 5 minutes
        cy.get('[data-cy=preparation-time]')
          .should('contain', '5:00');
        cy.get('[data-cy=mark-ready]').click();
      });
    });

    // Check efficiency metrics
    cy.get('[data-cy=efficiency-metrics]').within(() => {
      cy.get('[data-cy=avg-prep-time]')
        .should('contain', '5:00');
      cy.get('[data-cy=orders-per-hour]')
        .should('contain', '12');
    });
  });

  it('should handle order prioritization', () => {
    // Create orders with different priorities
    cy.createPriorityOrders([
      { priority: 'high', items: ['Steak'] },
      { priority: 'normal', items: ['Salad'] },
      { priority: 'high', items: ['Fish'] }
    ]);

    // Verify priority queue
    cy.get('[data-cy=priority-queue]').within(() => {
      cy.get('[data-cy=order-item]')
        .first().should('contain', 'Steak');
      cy.get('[data-cy=order-item]')
        .last().should('contain', 'Salad');
    });

    // Track completion order
    cy.get('[data-cy=completed-orders]').within(() => {
      cy.get('[data-cy=order-item]').should('have.length', 0);
      cy.tick(600000); // 10 minutes
      cy.get('[data-cy=order-item]').should('have.length', 3);
    });
  });

  it('should measure kitchen efficiency KPIs', () => {
    cy.createBatchOrders(10);
    
    // Start tracking metrics
    cy.get('[data-cy=start-tracking]').click();
    cy.tick(3600000); // 1 hour

    // Verify KPIs
    cy.get('[data-cy=kitchen-kpis]').within(() => {
      cy.get('[data-cy=orders-completed]')
        .should('be.gt', 0);
      cy.get('[data-cy=avg-preparation-time]')
        .should('be.lt', '00:15:00');
      cy.get('[data-cy=efficiency-score]')
        .should('be.gt', 85);
    });

    // Check performance report
    cy.get('[data-cy=generate-report]').click();
    cy.get('[data-cy=performance-report]')
      .should('contain', 'Kitchen Performance Report')
      .and('contain', 'Efficiency Score');
  });
});