"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permissions = void 0;
// src/config/permissions.ts
exports.Permissions = {
    ORDER: {
        CREATE: 'order:create',
        UPDATE: 'order:update',
        DELETE: 'order:delete',
        VIEW: 'order:view'
    },
    KITCHEN: {
        MANAGE: 'kitchen:manage',
        VIEW: 'kitchen:view'
    },
    ADMIN: {
        MANAGE_USERS: 'admin:users',
        MANAGE_SETTINGS: 'admin:settings'
    }
};
