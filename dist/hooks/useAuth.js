"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthorization = exports.useToken = exports.useAuth = void 0;
// src/hooks/useAuth.ts
const react_1 = require("react");
const AuthContext_1 = require("../context/AuthContext");
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext_1.AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
exports.useAuth = useAuth;
// src/hooks/useToken.ts
const react_2 = require("react");
const useToken = () => {
    const [token, setToken] = (0, react_2.useState)(localStorage.getItem('token'));
    const saveToken = (0, react_2.useCallback)((newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    }, []);
    const removeToken = (0, react_2.useCallback)(() => {
        localStorage.removeItem('token');
        setToken(null);
    }, []);
    return { token, saveToken, removeToken };
};
exports.useToken = useToken;
// src/hooks/useAuthorization.ts
const useAuth_1 = require("./useAuth");
const User_1 = require("../models/User");
const useAuthorization = () => {
    const { user } = (0, exports.useAuth)();
    const hasRole = (requiredRoles) => {
        if (!user)
            return false;
        return requiredRoles.includes(user.role);
    };
    const canAccessRoute = (route) => {
        const routePermissions = {
            '/admin': [User_1.UserRole.ADMIN],
            '/kitchen': [User_1.UserRole.KITCHEN, User_1.UserRole.ADMIN],
            '/orders': [User_1.UserRole.WAITER, User_1.UserRole.ADMIN]
        };
        return hasRole(routePermissions[route] || []);
    };
    return { hasRole, canAccessRoute };
};
exports.useAuthorization = useAuthorization;
