// src/services/PermissionService.ts
import { Redis } from 'ioredis';
import { UserRole } from '../models/User';
import { Permissions } from '../config/permissions';

export class PermissionService {
    private redis: Redis;
    private rolePermissions: Map<UserRole, string[]>;

    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379')
        });

        this.rolePermissions = new Map([
            [UserRole.ADMIN, Object.values(Permissions).flatMap(p => Object.values(p))],
            [UserRole.WAITER, [
                Permissions.ORDER.CREATE,
                Permissions.ORDER.UPDATE,
                Permissions.ORDER.VIEW
            ]],
            [UserRole.KITCHEN, [
                Permissions.KITCHEN.MANAGE,
                Permissions.KITCHEN.VIEW,
                Permissions.ORDER.UPDATE,
                Permissions.ORDER.VIEW
            ]]
        ]);
    }

    async hasPermission(userId: string, permission: string): Promise<boolean> {
        const cacheKey = `permissions:${userId}`;

        // Check cache first
        const cachedPermissions = await this.redis.get(cacheKey);
        if (cachedPermissions) {
            return JSON.parse(cachedPermissions).includes(permission);
        }

        // If not in cache, recalculate
        const user = await this.getUserRole(userId);
        if (!user) return false;

        const permissions = this.rolePermissions.get(user.role) || [];

        // Cache permissions
        await this.redis.setex(cacheKey, 3600, JSON.stringify(permissions));

        return permissions.includes(permission);
    }

    private async getUserRole(userId: string): Promise<{ role: UserRole } | null> {
        // Implementation to fetch user role from database
        return null;
    }
}