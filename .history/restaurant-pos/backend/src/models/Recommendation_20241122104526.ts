// backend/src/models/Recommendation.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export class Recommendation extends Model {
    declare id: string;
    declare productId: string;
    declare tips: string;
}

Recommendation.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    tips: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Recommendation'
});