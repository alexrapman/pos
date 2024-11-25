// backend/src/models/User.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public role!: 'admin' | 'waiter' | 'kitchen' | 'customer';
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'waiter', 'kitchen', 'customer'),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'User'
});