// frontend/cypress/support/commands/ui.commands.ts
Cypress.Commands.add('selectTable', (tableNumber: number) => {
    cy.get('[data-cy=table-select]').click();
    cy.get(`[data-cy=table-${tableNumber}]`).click();
  });
  
  Cypress.Commands.add('addItemToOrder', (itemName: string, quantity = 1) => {
    cy.get(`[data-cy=menu-item-${itemName.toLowerCase()}]`).click();
    if (quantity > 1) {
      for (let i = 1; i < quantity; i++) {
        cy.get(`[data-cy=increase-quantity-${itemName.toLowerCase()}]`).click();
      }
    }
  });