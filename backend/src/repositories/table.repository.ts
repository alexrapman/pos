// backend/src/repositories/table.repository.ts
import { Table } from '../models/table.model';
import { Order } from '../models/order.model';

export class TableRepository implements IBaseRepository<Table> {
  async create(data: Partial<Table>): Promise<Table> {
    return await Table.create(data);
  }

  async findById(id: number): Promise<Table | null> {
    return await Table.findByPk(id, {
      include: [{ model: Order }]
    });
  }

  async findAll(filters?: Partial<Table>): Promise<Table[]> {
    return await Table.findAll({
      where: filters,
      include: [{ model: Order }]
    });
  }

  async update(id: number, data: Partial<Table>): Promise<Table | null> {
    const table = await Table.findByPk(id);
    if (!table) return null;
    return await table.update(data);
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await Table.destroy({ where: { id } });
    return deleted > 0;
  }

  async findAvailable(): Promise<Table[]> {
    return await Table.findAll({
      where: { status: 'available' }
    });
  }
}