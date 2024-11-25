// frontend/cypress/support/commands/websocket.commands.ts
Cypress.Commands.add('mockWebSocket', () => {
    cy.window().then((win) => {
      win.mockSocket = {
        on: cy.stub().as('socketOn'),
        emit: cy.stub().as('socketEmit'),
        disconnect: cy.stub()
      };
    });
  });