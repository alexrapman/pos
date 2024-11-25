"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
// src/api/routes/authRoutes.ts
const express_1 = require("express");
const AuthService_1 = require("../../services/AuthService");
const validateAuth_1 = require("../middleware/validateAuth");
const router = (0, express_1.Router)();
exports.authRouter = router;
const authService = new AuthService_1.AuthService();
router.post('/login', validateAuth_1.validateAuth, async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const token = await authService.login(username, password);
        res.json({ token });
    }
    catch (error) {
        next(error);
    }
});
router.post('/register', validateAuth_1.validateAuth, async (req, res, next) => {
    try {
        const { username, password, role } = req.body;
        const user = await authService.register(username, password, role);
        res.status(201).json({
            id: user.id,
            username: user.username,
            role: user.role
        });
    }
    catch (error) {
        next(error);
    }
});
