describe('Order Flow', () => {
  it('should allow a waiter to create a new order', () => {
    cy.visit('/orders');
    cy.get('button').contains('New Order').click();
    cy.get('input[name="product"]').type('Pizza');
    cy.get('button').contains('Add to Order').click();
    cy.get('button').contains('Submit Order').click();
    cy.contains('Order submitted successfully');
  });
});