// backend/src/migrations/20240324000000-create-tables.ts
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // Users table
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('admin', 'waiter', 'kitchen'),
        allowNull: false
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    });

    // Tables table
    await queryInterface.createTable('tables', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('available', 'occupied', 'reserved'),
        defaultValue: 'available'
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    });

    // Orders table
    await queryInterface.createTable('orders', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tableId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'tables',
          key: 'id'
        }
      },
      status: {
        type: DataTypes.ENUM('pending', 'preparing', 'ready', 'delivered'),
        defaultValue: 'pending'
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('orders');
    await queryInterface.dropTable('tables');
    await queryInterface.dropTable('users');
  }
};