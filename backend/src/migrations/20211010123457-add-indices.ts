// backend/src/migrations/20211010123457-add-indices.ts
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.addIndex('Products', ['name']);
    await queryInterface.addIndex('Orders', ['userId']);
    await queryInterface.addIndex('Reservations', ['userId', 'date']);
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.removeIndex('Products', ['name']);
    await queryInterface.removeIndex('Orders', ['userId']);
    await queryInterface.removeIndex('Reservations', ['userId', 'date']);
}