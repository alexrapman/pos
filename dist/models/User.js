"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRole = void 0;
// src/models/User.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["WAITER"] = "WAITER";
    UserRole["KITCHEN"] = "KITCHEN";
})(UserRole || (exports.UserRole = UserRole = {}));
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        set(value) {
            const hash = bcrypt_1.default.hashSync(value, 10);
            this.setDataValue('password', hash);
        }
    },
    role: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(UserRole)),
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    modelName: 'User'
});
