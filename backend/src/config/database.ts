// backend/src/config/database.ts
import { Sequelize } from 'sequelize';
import { Environment } from './environment';

export class Database {
  private static instance: Sequelize;

  static getInstance(): Sequelize {
    if (!Database.instance) {
      const config = Environment.getInstance().config.database;
      
      Database.instance = new Sequelize({
        dialect: 'postgres',
        host: config.host,
        username: config.user,
        password: config.password,
        database: config.name,
        pool: {
          max: 20,
          min: 5,
          acquire: 30000,
          idle: 10000
        },
        logging: process.env.NODE_ENV !== 'production'
      });
    }
    return Database.instance;
  }
}
