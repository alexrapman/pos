// cypress/integration/dashboard/metrics-dashboard.spec.ts
describe('Metrics Dashboard', () => {
  beforeEach(() => {
    cy.login('admin@test.com', 'password');
    cy.visit('/admin/metrics');
  });

  it('should display all metric charts', () => {
    cy.get('[data-cy=metrics-chart]').should('have.length', 5);
    cy.get('[data-cy=response-time-chart]').should('be.visible');
    cy.get('[data-cy=requests-chart]').should('be.visible');
    cy.get('[data-cy=memory-usage-chart]').should('be.visible');
    cy.get('[data-cy=cpu-usage-chart]').should('be.visible');
    cy.get('[data-cy=connections-chart]').should('be.visible');
  });

  it('should change time range', () => {
    cy.get('[data-cy=time-range-select]').select('1d');
    cy.get('[data-cy=metrics-chart]').should('be.visible');
    // Verificar que los datos se actualizaron
    cy.get('[data-cy=loading-indicator]').should('not.exist');
  });

  it('should toggle auto-refresh', () => {
    cy.get('[data-cy=auto-refresh-toggle]').click();
    cy.get('[data-cy=auto-refresh-toggle]').should('not.be.checked');
    // Verificar que los datos no se actualizan automáticamente
    cy.wait(5000);
    cy.get('[data-cy=last-update-time]').invoke('text').should('remain.the.same');
  });
});