/ backend/src/repositories/base.repository.ts
export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: number): Promise<T | null>;
  findAll(filters?: Partial<T>): Promise<T[]>;
  update(id: number, data: Partial<T>): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}
