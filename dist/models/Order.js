"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.OrderStatus = void 0;
// src/models/Order.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PREPARING"] = "PREPARING";
    OrderStatus["READY"] = "READY";
    OrderStatus["DELIVERED"] = "DELIVERED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
class Order extends sequelize_1.Model {
}
exports.Order = Order;
Order.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    tableNumber: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    items: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(OrderStatus)),
        defaultValue: OrderStatus.PENDING
    },
    total: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    modelName: 'Order'
});
