// frontend/cypress/support/commands/order.commands.ts
Cypress.Commands.add('createOrder', (tableNumber: number, items: Cypress.OrderItem[]) => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/orders`,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: { tableNumber, items }
    });
  });