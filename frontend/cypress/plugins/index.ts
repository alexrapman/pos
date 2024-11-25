// frontend/cypress/plugins/index.ts
import { defineConfig } from 'cypress';
import { Pool } from 'pg';
import { sequelize } from '../../backend/src/config/database';

const dbConfig = {
  host: 'localhost',
  user: 'postgres',
  password: 'password',
  database: 'restaurant_pos_test'
};

const pool = new Pool(dbConfig);

export default defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      on('task', {
        async 'db:seed'() {
          try {
            await sequelize.sync({ force: true });
            // Seed test data
            await Promise.all([
              sequelize.models.User.bulkCreate([
                { username: 'admin@test.com', password: 'password123', role: 'admin' },
                { username: 'waiter@test.com', password: 'password123', role: 'waiter' },
                { username: 'kitchen@test.com', password: 'password123', role: 'kitchen' }
              ]),
              sequelize.models.Product.bulkCreate([
                { name: 'Pizza', price: 10, category: 'Food' },
                { name: 'Burger', price: 8, category: 'Food' },
                { name: 'Cola', price: 2, category: 'Drinks' }
              ])
            ]);
            return null;
          } catch (error) {
            throw new Error(`Error seeding database: ${error}`);
          }
        },

        async 'db:cleanup'() {
          try {
            await sequelize.drop();
            return null;
          } catch (error) {
            throw new Error(`Error cleaning database: ${error}`);
          }
        },

        async 'db:query'(query) {
          try {
            const result = await pool.query(query);
            return result.rows;
          } catch (error) {
            throw new Error(`Error executing query: ${error}`);
          }
        }
      });

      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push('--disable-dev-shm-usage');
          return launchOptions;
        }
      });

      return config;
    }
  }
});