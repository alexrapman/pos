// frontend/cypress/support/commands.ts
declare namespace Cypress {
  interface Chainable {
    login(role: string, password: string): void;
    createOrder(tableNumber: number, items: string[]): void;
    mockWebSocket(): void;
  }
}

Cypress.Commands.add('login', (role, password) => {
  cy.request('POST', '/api/auth/login', {
    username: `${role}@test.com`,
    password: password
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
    window.localStorage.setItem('userRole', role);
  });
});

Cypress.Commands.add('createOrder', (tableNumber, items) => {
  cy.request({
    method: 'POST',
    url: '/api/orders',
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('token')}`
    },
    body: {
      tableNumber,
      items: items.map(item => ({
        name: item,
        quantity: 1
      }))
    }
  });
});

Cypress.Commands.add('mockWebSocket', () => {
  cy.window().then((win) => {
    win.mockSocket = {
      on: cy.stub().as('socketOn'),
      emit: cy.stub().as('socketEmit')
    };
  });
});