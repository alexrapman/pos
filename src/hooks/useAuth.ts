// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// src/hooks/useToken.ts
import { useState, useCallback } from 'react';

export const useToken = () => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem('token')
    );

    const saveToken = useCallback((newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    }, []);

    const removeToken = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
    }, []);

    return { token, saveToken, removeToken };
};

// src/hooks/useAuthorization.ts
import { useAuth } from './useAuth';
import { UserRole } from '../models/User';

export const useAuthorization = () => {
    const { user } = useAuth();

    const hasRole = (requiredRoles: UserRole[]) => {
        if (!user) return false;
        return requiredRoles.includes(user.role);
    };

    const canAccessRoute = (route: string) => {
        const routePermissions: Record<string, UserRole[]> = {
            '/admin': [UserRole.ADMIN],
            '/kitchen': [UserRole.KITCHEN, UserRole.ADMIN],
            '/orders': [UserRole.WAITER, UserRole.ADMIN]
        };

        return hasRole(routePermissions[route] || []);
    };

    return { hasRole, canAccessRoute };
};