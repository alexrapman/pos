// cypress/integration/e2e/payment-flow.spec.ts
describe('Payment Flow E2E', () => {
  beforeEach(() => {
    cy.login('waiter@test.com', 'password');
    // Create test order
    cy.createOrder({
      tableId: 1,
      items: [
        { id: 1, name: 'Pizza', quantity: 2, price: 12.99 },
        { id: 2, name: 'Cola', quantity: 2, price: 2.50 }
      ]
    });
  });

  it('should process cash payment', () => {
    cy.visit('/orders');
    cy.get('[data-cy=process-payment]').click();

    // Verify total
    cy.get('[data-cy=total-amount]')
      .should('contain', '30.98');

    // Handle cash payment
    cy.get('[data-cy=payment-cash]').click();
    cy.get('[data-cy=cash-received]').type('40');
    cy.get('[data-cy=calculate-change]').click();
    cy.get('[data-cy=change-amount]')
      .should('contain', '9.02');

    cy.get('[data-cy=complete-payment]').click();
    
    // Verify receipt
    cy.get('[data-cy=receipt]').should('be.visible');
    cy.get('[data-cy=print-receipt]').click();
  });

  it('should process card payment', () => {
    cy.visit('/orders');
    cy.get('[data-cy=process-payment]').click();
    cy.get('[data-cy=payment-card]').click();

    // Fill card details
    cy.get('[data-cy=card-number]').type('4242424242424242');
    cy.get('[data-cy=card-expiry]').type('1225');
    cy.get('[data-cy=card-cvc]').type('123');

    cy.get('[data-cy=process-card]').click();

    // Verify success
    cy.get('[data-cy=payment-success]').should('be.visible');
    cy.get('[data-cy=transaction-id]').should('exist');
  });

  it('should handle split payments', () => {
    cy.visit('/orders');
    cy.get('[data-cy=process-payment]').click();
    cy.get('[data-cy=split-payment]').click();

    // Split amount
    cy.get('[data-cy=split-amount-1]').type('15.49');
    cy.get('[data-cy=payment-cash-1]').click();
    cy.get('[data-cy=split-amount-2]').should('contain', '15.49');
    cy.get('[data-cy=payment-card-2]').click();

    // Complete both payments
    cy.get('[data-cy=complete-split-payment]').click();
    cy.get('[data-cy=payment-success]').should('be.visible');
  });

  it('should handle refund process', () => {
    cy.visit('/orders');
    cy.get('[data-cy=view-receipt]').click();
    cy.get('[data-cy=initiate-refund]').click();

    // Verify refund amount
    cy.get('[data-cy=refund-amount]').should('contain', '30.98');
    cy.get('[data-cy=refund-reason]').type('Customer dissatisfaction');
    cy.get('[data-cy=confirm-refund]').click();

    // Verify refund success
    cy.get('[data-cy=refund-success]').should('be.visible');
    cy.get('[data-cy=refund-receipt]').should('exist');
  });
});