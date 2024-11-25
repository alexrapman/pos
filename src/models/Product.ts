// src/models/Product.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class Product extends Model {
    declare id: string;
    declare name: string;
    declare price: number;
    declare category: string;
    declare inStock: boolean;
}

Product.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    inStock: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'Product'
});