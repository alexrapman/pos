// backend/src/models/Recipe.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Recipe extends Model {
  public id!: number;
  public name!: string;
  public ingredients!: string[];
  public instructions!: string[];
  public preparationTime!: number;
  public difficulty!: 'easy' | 'medium' | 'hard';
  public tips!: string[];
}

Recipe.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ingredients: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  instructions: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  preparationTime: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    allowNull: false
  },
  tips: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
});
