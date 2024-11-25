// src/__tests__/integration/reservationErrors.test.ts
import request from 'supertest';
import { app } from '../../app';
import { sequelize } from '../../config/database';
import { Table, Reservation } from '../../models';
import { addHours } from 'date-fns';

describe('Reservation Error Scenarios', () => {
  const baseReservation = {
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '1234567890',
    tableId: 1,
    partySize: 4,
    duration: 2,
    date: addHours(new Date(), 24).toISOString()
  };

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await Table.create({ id: 1, number: 'A1', capacity: 4 });
  });

  it('should handle database connection errors', async () => {
    // Force database error
    jest.spyOn(sequelize, 'transaction').mockRejectedValueOnce(new Error('DB Error'));

    const response = await request(app)
      .post('/api/reservations')
      .send(baseReservation);

    expect(response.status).toBe(500);
    expect(response.body.error).toContain('Unable to process reservation');
  });

  it('should handle concurrent reservation attempts', async () => {
    // Attempt multiple concurrent reservations
    const promises = Array(3).fill(null).map(() =>
      request(app)
        .post('/api/reservations')
        .send(baseReservation)
    );

    const responses = await Promise.all(promises);
    const successfulReservations = responses.filter(r => r.status === 201);
    expect(successfulReservations).toHaveLength(1);
  });

  it('should handle invalid date formats', async () => {
    const response = await request(app)
      .post('/api/reservations')
      .send({
        ...baseReservation,
        date: 'invalid-date'
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({
        field: 'date',
        message: expect.stringContaining('Invalid date')
      })
    );
  });

  it('should handle non-existent table', async () => {
    const response = await request(app)
      .post('/api/reservations')
      .send({
        ...baseReservation,
        tableId: 999
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toContain('Table not found');
  });
});