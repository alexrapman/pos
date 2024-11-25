// frontend/cypress/support/commands/auth.commands.ts
Cypress.Commands.add('login', (email: string, password: string) => {
    cy.session([email], () => {
      cy.request('POST', `${Cypress.env('apiUrl')}/auth/login`, {
        email,
        password,
      }).then((response) => {
        window.localStorage.setItem('token', response.body.token);
      });
    });
  });