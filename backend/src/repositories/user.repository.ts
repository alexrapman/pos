// backend/src/repositories/user.repository.ts
import { User } from '../models/user.model';

export class UserRepository implements IBaseRepository<User> {
  async create(data: Partial<User>): Promise<User> {
    return await User.create(data);
  }

  async findById(id: number): Promise<User | null> {
    return await User.findByPk(id);
  }

  async findAll(filters?: Partial<User>): Promise<User[]> {
    return await User.findAll({ where: filters });
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(data);
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await User.destroy({ where: { id } });
    return deleted > 0;
  }

  async findByUsername(username: string): Promise<User | null> {
    return await User.findOne({ where: { username } });
  }
}