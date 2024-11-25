// src/__tests__/services/ReservationService.test.ts
import { ReservationService } from '../../services/ReservationService';
import { Table, Reservation } from '../../models';

jest.mock('../../models');

describe('ReservationService', () => {
  let service: ReservationService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ReservationService();
  });

  describe('createReservation', () => {
    const mockReservationData = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '1234567890',
      tableId: 1,
      date: new Date('2024-03-20T18:00:00Z'),
      partySize: 4,
      duration: 2
    };

    it('should create a valid reservation', async () => {
      (Table.findByPk as jest.Mock).mockResolvedValue({ 
        id: 1, 
        capacity: 4 
      });
      
      (Reservation.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...mockReservationData
      });

      const result = await service.createReservation(mockReservationData);

      expect(result).toHaveProperty('id', 1);
      expect(Reservation.create).toHaveBeenCalledWith(mockReservationData);
    });

    it('should throw error if table capacity is exceeded', async () => {
      (Table.findByPk as jest.Mock).mockResolvedValue({ 
        id: 1, 
        capacity: 2 
      });

      await expect(
        service.createReservation(mockReservationData)
      ).rejects.toThrow('Table capacity exceeded');
    });
  });
});