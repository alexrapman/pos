// src/__tests__/services/TimeSlotConflictService.test.ts
import { TimeSlotConflictService } from '../../services/TimeSlotConflictService';
import { Reservation } from '../../models';
import { addHours } from 'date-fns';

describe('TimeSlotConflictService', () => {
  let service: TimeSlotConflictService;

  beforeEach(() => {
    service = new TimeSlotConflictService();
    jest.clearAllMocks();
  });

  describe('detectConflicts', () => {
    const baseDate = new Date('2024-03-20T18:00:00Z');

    it('should detect overlapping reservations', async () => {
      const existingReservation = {
        id: 1,
        tableId: 1,
        date: baseDate,
        duration: 2
      };

      (Reservation.findOne as jest.Mock).mockResolvedValue(existingReservation);

      const hasConflict = await service.detectConflict({
        tableId: 1,
        date: addHours(baseDate, 1),
        duration: 2
      });

      expect(hasConflict).toBe(true);
    });

    it('should allow adjacent non-overlapping reservations', async () => {
      const existingReservation = {
        id: 1,
        tableId: 1,
        date: baseDate,
        duration: 2
      };

      (Reservation.findOne as jest.Mock).mockResolvedValue(existingReservation);

      const hasConflict = await service.detectConflict({
        tableId: 1,
        date: addHours(baseDate, 2),
        duration: 2
      });

      expect(hasConflict).toBe(false);
    });

    it('should handle multiple existing reservations', async () => {
      (Reservation.findOne as jest.Mock).mockResolvedValue([
        {
          id: 1,
          tableId: 1,
          date: baseDate,
          duration: 2
        },
        {
          id: 2,
          tableId: 1,
          date: addHours(baseDate, 4),
          duration: 2
        }
      ]);

      const hasConflict = await service.detectConflict({
        tableId: 1,
        date: addHours(baseDate, 2),
        duration: 2
      });

      expect(hasConflict).toBe(false);
    });

    it('should exclude current reservation when checking conflicts', async () => {
      const existingReservation = {
        id: 1,
        tableId: 1,
        date: baseDate,
        duration: 2
      };

      (Reservation.findOne as jest.Mock).mockResolvedValue(existingReservation);

      const hasConflict = await service.detectConflict({
        id: 1,
        tableId: 1,
        date: baseDate,
        duration: 2
      });

      expect(hasConflict).toBe(false);
    });
  });
});