// frontend/cypress/integration/reports-analytics.spec.ts
import { loadFixtures } from '../support/helpers/fixtures.helper';

describe('Reports and Analytics', () => {
  beforeEach(() => {
    loadFixtures.loadTestData();
    cy.task('db:seed');
    cy.loginAs('admin');
  });

  describe('Sales Reports', () => {
    it('should generate daily sales report', () => {
      cy.visit('/admin/reports');
      
      cy.get('[data-cy=date-picker]').type('2024-03-14');
      cy.get('[data-cy=generate-report]').click();

      cy.get('[data-cy=sales-summary]').within(() => {
        cy.get('[data-cy=total-sales]').should('contain', '$');
        cy.get('[data-cy=order-count]').should('not.contain', '0');
        cy.get('[data-cy=average-order]').should('contain', '$');
      });

      // Verify chart data
      cy.get('[data-cy=sales-chart]').should('be.visible');
      cy.get('[data-cy=export-csv]').click();
      cy.readFile('cypress/downloads/sales-report.csv').should('exist');
    });

    it('should display performance metrics', () => {
      cy.visit('/admin/analytics');

      cy.get('[data-cy=performance-metrics]').within(() => {
        cy.get('[data-cy=peak-hours]').should('be.visible');
        cy.get('[data-cy=popular-items]').should('be.visible');
        cy.get('[data-cy=revenue-trend]').should('be.visible');
      });

      // Filter and verify data
      cy.get('[data-cy=date-range]').select('last7days');
      cy.get('[data-cy=metrics-data]').should('be.visible');
    });

    it('should generate detailed analytics report', () => {
      cy.visit('/admin/analytics/detailed');

      // Configure report parameters
      cy.get('[data-cy=report-type]').select('comprehensive');
      cy.get('[data-cy=start-date]').type('2024-03-01');
      cy.get('[data-cy=end-date]').type('2024-03-14');
      cy.get('[data-cy=generate-detailed]').click();

      // Verify report sections
      cy.get('[data-cy=sales-analysis]').should('be.visible');
      cy.get('[data-cy=product-performance]').should('be.visible');
      cy.get('[data-cy=staff-performance]').should('be.visible');

      // Export report
      cy.get('[data-cy=export-pdf]').click();
      cy.readFile('cypress/downloads/detailed-report.pdf').should('exist');
    });
  });
});