"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteGuard = void 0;
// src/guards/RouteGuard.tsx
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const useAuth_1 = require("../hooks/useAuth");
const RouteGuard = ({ children, roles }) => {
    const { user } = (0, useAuth_1.useAuth)();
    const location = (0, react_router_dom_1.useLocation)();
    if (!user) {
        return <react_router_dom_1.Navigate to="/login" state={{ from: location }} replace/>;
    }
    if (roles && !roles.includes(user.role)) {
        return <react_router_dom_1.Navigate to="/unauthorized" replace/>;
    }
    return <>{children}</>;
};
exports.RouteGuard = RouteGuard;
