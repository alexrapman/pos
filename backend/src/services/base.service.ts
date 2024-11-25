// backend/src/services/base.service.ts
import { IBaseRepository } from '../repositories/base.repository';

export abstract class BaseService<T> {
  constructor(protected repository: IBaseRepository<T>) {}

  async create(data: Partial<T>): Promise<T> {
    return await this.repository.create(data);
  }

  async findById(id: number): Promise<T | null> {
    return await this.repository.findById(id);
  }

  async findAll(filters?: Partial<T>): Promise<T[]> {
    return await this.repository.findAll(filters);
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    return await this.repository.update(id, data);
  }

  async delete(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}