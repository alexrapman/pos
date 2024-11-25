// backend/src/models/Inventory.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Supplier extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string;
  public address!: string;
}

Supplier.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: DataTypes.STRING,
  address: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Supplier'
});

export class StockMovement extends Model {
  public id!: number;
  public productId!: number;
  public quantity!: number;
  public type!: 'in' | 'out';
  public reason!: string;
}

StockMovement.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('in', 'out'),
    allowNull: false
  },
  reason: DataTypes.STRING
}, {
  sequelize,
  modelName: 'StockMovement'
});

export class PurchaseOrder extends Model {
  public id!: number;
  public supplierId!: number;
  public status!: 'pending' | 'approved' | 'received';
  public totalAmount!: number;
}

PurchaseOrder.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'received'),
    defaultValue: 'pending'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'PurchaseOrder'
});