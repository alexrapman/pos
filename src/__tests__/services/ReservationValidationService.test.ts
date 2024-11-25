// src/__tests__/services/ReservationValidationService.test.ts
import { ReservationValidationService } from '../../services/ReservationValidationService';
import { addHours, subMinutes } from 'date-fns';

describe('ReservationValidationService', () => {
  let service: ReservationValidationService;
  const baseReservation = {
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '1234567890',
    tableId: 1,
    partySize: 4,
    duration: 2
  };

  beforeEach(() => {
    service = ReservationValidationService.getInstance();
    jest.clearAllMocks();
  });

  describe('validateBasicFields', () => {
    it('should validate valid reservation data', async () => {
      const result = await service.validateReservation({
        ...baseReservation,
        date: addHours(new Date(), 2)
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid email', async () => {
      const result = await service.validateReservation({
        ...baseReservation,
        customerEmail: 'invalid-email',
        date: addHours(new Date(), 2)
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valid email address is required');
    });

    it('should reject party size exceeding maximum', async () => {
      const result = await service.validateReservation({
        ...baseReservation,
        partySize: 15,
        date: addHours(new Date(), 2)
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Party size cannot exceed 12');
    });
  });

  describe('validateTimeSlot', () => {
    it('should reject reservations with less than minimum advance time', async () => {
      const result = await service.validateReservation({
        ...baseReservation,
        date: subMinutes(new Date(), 30)
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Reservations must be made at least 60 minutes in advance');
    });

    it('should detect time slot conflicts', async () => {
      jest.spyOn(service as any, 'checkTimeSlotConflicts')
        .mockResolvedValue(true);

      const result = await service.validateReservation({
        ...baseReservation,
        date: addHours(new Date(), 2)
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('The selected time slot is not available');
    });
  });
});