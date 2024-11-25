// backend/src/models/base.model.ts
import { Model, DataTypes } from 'sequelize';
import { Database } from '../config/database';

export class BaseModel extends Model {
  public id!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}
