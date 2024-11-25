// src/guards/RouteGuard.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../models/User';

interface RouteGuardProps {
    children: React.ReactNode;
    roles?: UserRole[];
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, roles }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};