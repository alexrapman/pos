// frontend/cypress/support/helpers/test.helpers.ts
export const testHelpers = {
  // Data generators
  generateOrderData(tableNumber: number = 1): Cypress.Order {
    return {
      id: Date.now(),
      tableNumber,
      status: 'pending',
      items: [
        { name: 'Pizza', quantity: 1, price: 10 },
        { name: 'Cola', quantity: 2, price: 2 }
      ],
      total: 14,
      createdAt: new Date().toISOString()
    };
  },

  // Mock helpers
  mockApiResponse(route: string, response: any, status: number = 200) {
    cy.intercept(route, {
      statusCode: status,
      body: response
    }).as('apiCall');
  },

  // UI interaction helpers
  fillOrderForm(order: Partial<Cypress.Order>) {
    if (order.tableNumber) {
      cy.selectTable(order.tableNumber);
    }
    order.items?.forEach(item => {
      cy.addItemToOrder(item.name, item.quantity);
    });
  },

  // Assertion helpers
  verifyOrderDetails(order: Cypress.Order) {
    cy.get('[data-cy=order-details]').within(() => {
      cy.get('[data-cy=table-number]').should('contain', order.tableNumber);
      cy.get('[data-cy=order-status]').should('contain', order.status);
      cy.get('[data-cy=order-total]').should('contain', order.total);
      
      order.items.forEach(item => {
        cy.get('[data-cy=order-items]').should('contain', item.name)
          .and('contain', item.quantity);
      });
    });
  }
};