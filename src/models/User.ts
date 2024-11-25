// src/models/User.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcrypt';

export enum UserRole {
    ADMIN = 'ADMIN',
    WAITER = 'WAITER',
    KITCHEN = 'KITCHEN'
}

export class User extends Model {
    declare id: string;
    declare username: string;
    declare password: string;
    declare role: UserRole;
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value: string) {
            const hash = bcrypt.hashSync(value, 10);
            this.setDataValue('password', hash);
        }
    },
    role: {
        type: DataTypes.ENUM(...Object.values(UserRole)),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User'
});