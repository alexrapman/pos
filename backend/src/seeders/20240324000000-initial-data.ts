// backend/src/seeders/20240324000000-initial-data.ts
import { QueryInterface } from 'sequelize';
import bcrypt from 'bcrypt';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await queryInterface.bulkInsert('users', [{
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Create sample tables
    await queryInterface.bulkInsert('tables', 
      Array.from({ length: 10 }, (_, i) => ({
        number: `T${i + 1}`,
        capacity: 4,
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    // Create sample orders
    await queryInterface.bulkInsert('orders', [
      {
        tableId: 1,
        status: 'delivered',
        total: 45.99,
        createdAt: new Date(Date.now() - 86400000), // Yesterday
        updatedAt: new Date(Date.now() - 86400000)
      },
      {
        tableId: 2,
        status: 'preparing',
        total: 32.50,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('orders', {});
    await queryInterface.bulkDelete('tables', {});
    await queryInterface.bulkDelete('users', {});
  }
};