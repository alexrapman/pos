// backend/src/models/user.model.ts
import { DataTypes } from 'sequelize';
import { BaseModel } from './base.model';
import { Database } from '../config/database';

export class User extends BaseModel {
  public username!: string;
  public password!: string;
  public role!: 'admin' | 'waiter' | 'kitchen';
}

User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'waiter', 'kitchen'),
    allowNull: false
  }
}, {
  sequelize: Database.getInstance(),
  tableName: 'users'
});
