// frontend/cypress/integration/order-management.spec.ts
import { loadFixtures } from '../support/helpers/fixtures.helper';
import { testHelpers } from '../support/helpers/test.helpers';

describe('Order Management Integration', () => {
  beforeEach(() => {
    loadFixtures.loadTestData();
    cy.task('db:seed');
  });

  describe('Waiter Flow', () => {
    beforeEach(() => {
      cy.getTestUser('waiter').then(user => {
        cy.login(user.email, user.password);
      });
    });

    it('should create and manage order', () => {
      cy.visit('/orders/new');
      
      // Get test data
      cy.get('@products').then(({ menuItems }) => {
        // Create order
        testHelpers.fillOrderForm({
          tableNumber: 5,
          items: [
            { name: menuItems[0].name, quantity: 2 }
          ]
        });

        // Submit order
        cy.get('[data-cy=submit-order]').click();

        // Verify order creation
        cy.get('[data-cy=order-success]').should('be.visible');
        cy.url().should('include', '/orders');

        // Verify order details
        cy.getTestOrder().then(order => {
          testHelpers.verifyOrderDetails(order);
        });
      });
    });
  });

  describe('Kitchen Flow', () => {
    beforeEach(() => {
      cy.getTestUser('kitchen').then(user => {
        cy.login(user.email, user.password);
      });
      // Create test order
      cy.getTestOrder().then(order => {
        cy.createOrder(order.tableNumber, order.items);
      });
    });

    it('should process order in kitchen', () => {
      cy.visit('/kitchen');

      cy.get('[data-cy=order-card]').within(() => {
        // Start preparing
        cy.get('[data-cy=start-preparing]').click();
        cy.get('[data-cy=order-status]').should('contain', 'preparing');

        // Mark as ready
        cy.get('[data-cy=mark-ready]').click();
        cy.get('[data-cy=order-status]').should('contain', 'ready');
      });
    });
  });
});