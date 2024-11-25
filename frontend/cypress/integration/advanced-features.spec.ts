// frontend/cypress/integration/advanced-features.spec.ts
import { loadFixtures } from '../support/helpers/fixtures.helper';
import { testHelpers } from '../support/helpers/test.helpers';

describe('Advanced Features Integration', () => {
  beforeEach(() => {
    loadFixtures.loadTestData();
    cy.task('db:seed');
  });

  describe('Complete Order to Payment Flow', () => {
    beforeEach(() => {
      cy.loginAs('waiter');
    });

    it('should process order from creation to payment', () => {
      // Create order
      cy.visit('/orders/new');
      testHelpers.fillOrderForm({
        tableNumber: 3,
        items: [{ name: 'Pizza Margherita', quantity: 2 }]
      });
      cy.get('[data-cy=submit-order]').click();

      // Kitchen process
      cy.loginAs('kitchen');
      cy.visit('/kitchen');
      cy.get('[data-cy=start-preparing]').click();
      cy.get('[data-cy=mark-ready]').click();

      // Waiter delivery and payment
      cy.loginAs('waiter');
      cy.visit('/orders');
      cy.get('[data-cy=mark-delivered]').click();
      cy.get('[data-cy=process-payment]').click();

      // Payment process
      cy.get('[data-cy=payment-amount]').should('contain', '21.98');
      cy.get('[data-cy=payment-cash]').click();
      cy.get('[data-cy=cash-received]').type('25');
      cy.get('[data-cy=complete-payment]').click();

      // Verify receipt
      cy.get('[data-cy=receipt]')
        .should('contain', 'Table 3')
        .and('contain', 'Total: $21.98')
        .and('contain', 'Change: $3.02');
    });
  });

  describe('Table Management', () => {
    beforeEach(() => {
      cy.loginAs('waiter');
    });

    it('should manage table reservations', () => {
      cy.visit('/tables');
      
      // Create reservation
      cy.get('[data-cy=create-reservation]').click();
      cy.get('[data-cy=reservation-name]').type('John Doe');
      cy.get('[data-cy=reservation-date]').type('2024-03-20');
      cy.get('[data-cy=reservation-time]').type('19:00');
      cy.get('[data-cy=reservation-guests]').type('4');
      cy.get('[data-cy=submit-reservation]').click();

      // Verify reservation
      cy.get('[data-cy=reservation-card]')
        .should('contain', 'John Doe')
        .and('contain', 'March 20, 2024')
        .and('contain', '7:00 PM')
        .and('contain', '4 guests');
    });
  });
});