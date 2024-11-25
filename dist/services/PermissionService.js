"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionService = void 0;
// src/services/PermissionService.ts
const ioredis_1 = require("ioredis");
const User_1 = require("../models/User");
const permissions_1 = require("../config/permissions");
class PermissionService {
    constructor() {
        this.redis = new ioredis_1.Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379')
        });
        this.rolePermissions = new Map([
            [User_1.UserRole.ADMIN, Object.values(permissions_1.Permissions).flatMap(p => Object.values(p))],
            [User_1.UserRole.WAITER, [
                    permissions_1.Permissions.ORDER.CREATE,
                    permissions_1.Permissions.ORDER.UPDATE,
                    permissions_1.Permissions.ORDER.VIEW
                ]],
            [User_1.UserRole.KITCHEN, [
                    permissions_1.Permissions.KITCHEN.MANAGE,
                    permissions_1.Permissions.KITCHEN.VIEW,
                    permissions_1.Permissions.ORDER.UPDATE,
                    permissions_1.Permissions.ORDER.VIEW
                ]]
        ]);
    }
    async hasPermission(userId, permission) {
        const cacheKey = `permissions:${userId}`;
        // Check cache first
        const cachedPermissions = await this.redis.get(cacheKey);
        if (cachedPermissions) {
            return JSON.parse(cachedPermissions).includes(permission);
        }
        // If not in cache, recalculate
        const user = await this.getUserRole(userId);
        if (!user)
            return false;
        const permissions = this.rolePermissions.get(user.role) || [];
        // Cache permissions
        await this.redis.setex(cacheKey, 3600, JSON.stringify(permissions));
        return permissions.includes(permission);
    }
    async getUserRole(userId) {
        // Implementation to fetch user role from database
        return null;
    }
}
exports.PermissionService = PermissionService;
