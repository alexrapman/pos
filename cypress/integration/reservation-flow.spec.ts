// cypress/integration/reservation-flow.spec.ts
describe('Reservation System E2E', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login('test@example.com', 'password');
  });

  it('should complete full reservation flow', () => {
    cy.visit('/tables');
    cy.get('[data-cy=table-1]').click();
    cy.get('[data-cy=make-reservation]').click();

    // Fill reservation form
    cy.get('[data-cy=customer-name]').type('John Doe');
    cy.get('[data-cy=customer-email]').type('john@example.com');
    cy.get('[data-cy=customer-phone]').type('1234567890');
    cy.get('[data-cy=party-size]').type('4');
    cy.get('[data-cy=reservation-date]').type('2024-12-25');
    cy.get('[data-cy=reservation-time]').type('19:00');

    cy.get('[data-cy=submit-reservation]').click();

    // Verify success
    cy.get('[data-cy=reservation-confirmation]')
      .should('be.visible')
      .and('contain', 'Reservation confirmed');
  });
});