// src/__tests__/integration/reservationSystem.test.ts
import request from 'supertest';
import { app } from '../../app';
import { sequelize } from '../../config/database';
import { Table, Reservation } from '../../models';
import { addHours } from 'date-fns';

describe('Reservation System Integration', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    // Seed test data
    await Table.create({
      id: 1,
      number: 'A1',
      capacity: 4
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Reservation Flow', () => {
    const baseReservation = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '1234567890',
      tableId: 1,
      partySize: 4,
      duration: 2,
      date: addHours(new Date(), 24).toISOString()
    };

    it('should create and retrieve a reservation', async () => {
      // Create reservation
      const createResponse = await request(app)
        .post('/api/reservations')
        .send(baseReservation);

      expect(createResponse.status).toBe(201);
      const reservationId = createResponse.body.id;

      // Verify creation
      const getResponse = await request(app)
        .get(`/api/reservations/${reservationId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toMatchObject({
        ...baseReservation,
        id: reservationId
      });
    });

    it('should handle conflicting reservations', async () => {
      // Create first reservation
      await request(app)
        .post('/api/reservations')
        .send(baseReservation);

      // Attempt to create conflicting reservation
      const conflictResponse = await request(app)
        .post('/api/reservations')
        .send({
          ...baseReservation,
          date: addHours(new Date(baseReservation.date), 1).toISOString()
        });

      expect(conflictResponse.status).toBe(400);
      expect(conflictResponse.body.error).toContain('time slot is not available');
    });

    it('should handle reservation updates', async () => {
      // Create reservation
      const createResponse = await request(app)
        .post('/api/reservations')
        .send(baseReservation);

      const reservationId = createResponse.body.id;

      // Update reservation
      const updateResponse = await request(app)
        .patch(`/api/reservations/${reservationId}`)
        .send({
          customerPhone: '0987654321'
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.customerPhone).toBe('0987654321');
    });

    it('should enforce business rules', async () => {
      const invalidReservation = {
        ...baseReservation,
        partySize: 20 // Exceeds maximum
      };

      const response = await request(app)
        .post('/api/reservations')
        .send(invalidReservation);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Party size cannot exceed');
    });
  });
});