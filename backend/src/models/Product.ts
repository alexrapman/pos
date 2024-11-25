// backend/src/models/Product.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface ProductAttributes {
    id: number;
    name: string;
    price: number;
    allergens: string[];
    stock: number;
}

class Product extends Model<ProductAttributes> implements ProductAttributes {
    public id!: number;
    public name!: string;
    public price!: number;
    public allergens!: string[];
    public stock!: number;
}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        allergens: {
            type: DataTypes.JSON,
            defaultValue: [],
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'Product',
    }
);

export default Product;