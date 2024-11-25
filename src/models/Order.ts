// src/models/Order.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export enum OrderStatus {
    PENDING = 'PENDING',
    PREPARING = 'PREPARING',
    READY = 'READY',
    DELIVERED = 'DELIVERED'
}

export class Order extends Model {
    declare id: string;
    declare tableNumber: number;
    declare items: OrderItem[];
    declare status: OrderStatus;
    declare total: number;
    declare createdAt: Date;
    declare updatedAt: Date;
}

interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
    notes?: string;
}

Order.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    tableNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    items: {
        type: DataTypes.JSON,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(...Object.values(OrderStatus)),
        defaultValue: OrderStatus.PENDING
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Order'
});