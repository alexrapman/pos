// backend/src/migrations/config.ts
import { Environment } from '../config/environment';

const env = Environment.getInstance();
const dbConfig = env.config.database;

module.exports = {
  development: {
    username: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.name,
    host: dbConfig.host,
    dialect: 'postgres'
  },
  production: {
    username: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.name,
    host: dbConfig.host,
    dialect: 'postgres',
    logging: false
  }
};