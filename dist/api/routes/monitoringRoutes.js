"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitoringRouter = void 0;
// src/api/routes/monitoringRoutes.ts
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const SessionCleanupService_1 = require("../../services/SessionCleanupService");
const User_1 = require("../../models/User");
const router = (0, express_1.Router)();
exports.monitoringRouter = router;
const sessionCleanup = new SessionCleanupService_1.SessionCleanupService();
router.get('/stats', (0, authMiddleware_1.authorize)([User_1.UserRole.ADMIN]), async (req, res) => {
    const stats = await sessionCleanup.getSessionStats();
    res.json(stats);
});
