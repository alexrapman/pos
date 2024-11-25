// backend/src/models/Reservation.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class Reservation extends Model {
    declare id: string;
    declare userId: string;
    declare tableNumber: number;
    declare date: Date;
    declare time: string;
}

Reservation.init({
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
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Reservation'
});