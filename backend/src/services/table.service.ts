// backend/src/services/table.service.ts
import { Table } from '../models/table.model';
import { TableRepository } from '../repositories/table.repository';
import { ReservationRepository } from '../repositories/reservation.repository';
import { EventEmitter } from '../utils/eventEmitter';

export class TableService extends BaseService<Table> {
  private reservationRepository: ReservationRepository;
  private eventEmitter: EventEmitter;

  constructor() {
    super(new TableRepository());
    this.reservationRepository = new ReservationRepository();
    this.eventEmitter = EventEmitter.getInstance();
  }

  async assignTable(tableId: number, status: Table['status']): Promise<Table> {
    const table = await this.repository.findById(tableId);
    if (!table) throw new Error('Table not found');
    if (table.status !== 'available') throw new Error('Table not available');

    const updatedTable = await this.repository.update(tableId, { status });
    this.eventEmitter.emit('tableStatusChanged', updatedTable);
    return updatedTable;
  }

  async checkAvailability(date: Date, partySize: number): Promise<Table[]> {
    const tables = await this.repository.findAll({ status: 'available' });
    const reservations = await this.reservationRepository.findByDate(date);

    return tables.filter(table => {
      const hasReservation = reservations.some(r => r.tableId === table.id);
      return !hasReservation && table.capacity >= partySize;
    });
  }
}