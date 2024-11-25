// backend/src/models/Order.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class Order extends Model {
    declare id: string;
    declare userId: string;
    declare tableNumber: number;
    declare status: 'pending' | 'preparing' | 'served' | 'paid';
    declare items: { productId: string, quantity: number }[];
    declare total: number;
}

Order.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    tableNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'preparing', 'served', 'paid'),
        allowNull: false,
        defaultValue: 'pending'
    },
    items: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Order'
});

export default Order;