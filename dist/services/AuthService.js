"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// src/services/AuthService.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
class AuthService {
    async login(username, password) {
        const user = await User_1.User.findOne({ where: { username } });
        if (!user || !(await user.validatePassword(password))) {
            throw new Error('Invalid credentials');
        }
        return jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    }
    async register(username, password, role) {
        return User_1.User.create({ username, password, role });
    }
}
exports.AuthService = AuthService;
