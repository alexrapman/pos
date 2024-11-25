"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatusBadge = void 0;
// src/components/ui/OrderStatusBadge.tsx
const react_1 = __importDefault(require("react"));
const Order_1 = require("../../models/Order");
const statusColors = {
    [Order_1.OrderStatus.PENDING]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    [Order_1.OrderStatus.PREPARING]: { bg: 'bg-blue-100', text: 'text-blue-800' },
    [Order_1.OrderStatus.READY]: { bg: 'bg-green-100', text: 'text-green-800' },
    [Order_1.OrderStatus.DELIVERED]: { bg: 'bg-gray-100', text: 'text-gray-800' },
    [Order_1.OrderStatus.CANCELLED]: { bg: 'bg-red-100', text: 'text-red-800' }
};
const OrderStatusBadge = ({ status, size = 'md' }) => {
    const { bg, text } = statusColors[status];
    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base'
    };
    return (<span className={`
            inline-flex items-center rounded-full
            font-medium
            ${bg} ${text} ${sizeClasses[size]}
        `}>
            {status}
        </span>);
};
exports.OrderStatusBadge = OrderStatusBadge;
