"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = void 0;
// src/components/navigation/Sidebar.tsx
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const useAuth_1 = require("../../hooks/useAuth");
const User_1 = require("../../models/User");
const routes = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        icon: 'ChartPieIcon',
        roles: [User_1.UserRole.ADMIN, User_1.UserRole.WAITER, User_1.UserRole.KITCHEN]
    },
    {
        path: '/orders',
        name: 'Orders',
        icon: 'ClipboardListIcon',
        roles: [User_1.UserRole.WAITER, User_1.UserRole.KITCHEN]
    },
    {
        path: '/kitchen',
        name: 'Kitchen Display',
        icon: 'FireIcon',
        roles: [User_1.UserRole.KITCHEN]
    },
    {
        path: '/admin',
        name: 'Administration',
        icon: 'CogIcon',
        roles: [User_1.UserRole.ADMIN]
    }
];
const Sidebar = () => {
    const { user } = (0, useAuth_1.useAuth)();
    return (<aside className="w-64 bg-white dark:bg-gray-800 h-screen">
            <nav className="mt-5 px-2">
                {routes
            .filter(route => route.roles.includes(user?.role))
            .map(route => (<react_router_dom_1.NavLink key={route.path} to={route.path} className={({ isActive }) => `flex items-center px-4 py-2 mt-2 rounded-lg
                                ${isActive
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                            <span>{route.name}</span>
                        </react_router_dom_1.NavLink>))}
            </nav>
        </aside>);
};
exports.Sidebar = Sidebar;
