// src/config/permissions.ts
export const Permissions = {
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
} as const;