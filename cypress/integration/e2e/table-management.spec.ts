// cypress/integration/e2e/table-management.spec.ts
describe('Table Management E2E', () => {
  beforeEach(() => {
    cy.login('admin@test.com', 'password');
    cy.visit('/tables');
  });

  it('should manage table status changes', () => {
    // Change table status
    cy.get('[data-cy=table-1]').click();
    cy.get('[data-cy=status-select]').select('occupied');
    
    // Verify status change
    cy.get('[data-cy=table-1]')
      .should('have.class', 'bg-red-50')
      .and('contain', 'Occupied');

    // Check status history
    cy.get('[data-cy=view-history]').click();
    cy.get('[data-cy=status-history]')
      .should('contain', 'Status changed to occupied');

    // Add notes to table
    cy.get('[data-cy=add-note]').click();
    cy.get('[data-cy=note-input]').type('VIP customer');
    cy.get('[data-cy=save-note]').click();
    cy.get('[data-cy=table-notes]').should('contain', 'VIP customer');
  });

  it('should handle QR code operations', () => {
    cy.get('[data-cy=table-1]').click();
    cy.get('[data-cy=generate-qr]').click();

    // Verify QR code
    cy.get('[data-cy=qr-code]').should('be.visible');
    cy.get('[data-cy=download-qr]').click();

    // Verify download
    cy.readFile('cypress/downloads/table-1-qr.png').should('exist');
  });

  it('should manage table assignments', () => {
    // Create reservation
    cy.createReservation({
      name: 'John Doe',
      date: 'tomorrow',
      table: 1
    });

    // Verify table assignment
    cy.get('[data-cy=table-1]')
      .should('contain', 'Reserved')
      .and('contain', 'John Doe');

    // Test reservation link
    cy.get('[data-cy=view-reservation]').click();
    cy.url().should('include', '/reservations/');
  });

  it('should show table availability correctly', () => {
    // Set operating hours
    cy.intercept('GET', '/api/settings/hours', {
      open: '11:00',
      close: '23:00'
    });

    // Check availability timeline
    cy.get('[data-cy=availability-view]').click();
    cy.get('[data-cy=timeline]').should('be.visible');

    // Verify available slots
    cy.get('[data-cy=available-slots]')
      .should('have.length.gt', 0)
      .first()
      .click();

    // Confirm booking option
    cy.get('[data-cy=book-table]').should('be.enabled');
  });

  it('should handle table reservations', () => {
    // Create reservation
    cy.get('[data-cy=table-2]').click();
    cy.get('[data-cy=reserve-table]').click();
    cy.fillReservationForm({
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '0987654321',
      date: '2024-12-25',
      time: '20:00',
      party: 4
    });

    // Verify reservation
    cy.get('[data-cy=table-2]')
      .should('have.class', 'bg-yellow-50')
      .and('contain', 'Reserved');
    cy.get('[data-cy=reservation-info]')
      .should('contain', 'Jane Doe')
      .and('contain', '8:00 PM');
  });

  it('should manage QR codes', () => {
    // Generate QR code
    cy.get('[data-cy=table-3]').click();
    cy.get('[data-cy=generate-qr]').click();
    cy.get('[data-cy=qr-code]').should('be.visible');

    // Download QR code
    cy.get('[data-cy=download-qr]').click();
    cy.readFile('cypress/downloads/table-3-qr.png').should('exist');

    // Test QR code scanning
    cy.get('[data-cy=test-qr]').click();
    cy.get('[data-cy=scan-result]')
      .should('contain', 'Table 3')
      .and('contain', 'Valid QR Code');
  });

  it('should enforce capacity limits', () => {
    // Attempt to exceed capacity
    cy.get('[data-cy=table-4]').click();
    cy.get('[data-cy=reserve-table]').click();
    cy.fillReservationForm({
      name: 'Large Group',
      email: 'group@example.com',
      phone: '1231231234',
      date: '2024-12-26',
      time: '19:00',
      party: 10 // Table capacity is 6
    });

    // Verify error message
    cy.get('[data-cy=capacity-error]')
      .should('be.visible')
      .and('contain', 'exceeds table capacity');
  });
});