"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KitchenDisplaySystem = void 0;
// src/components/kitchen/KitchenDisplaySystem.tsx
const react_1 = __importStar(require("react"));
const react_hotkeys_hook_1 = require("react-hotkeys-hook");
const KitchenGrid_1 = require("./KitchenGrid");
const OrderStatusBar_1 = require("./OrderStatusBar");
const useOrderSync_1 = require("../../hooks/useOrderSync");
const Order_1 = require("../../models/Order");
const KitchenDisplaySystem = () => {
    const { orders, connected } = (0, useOrderSync_1.useOrderSync)();
    const [activeOrders, setActiveOrders] = (0, react_1.useState)([]);
    const [notification] = (0, react_1.useState)(new Audio('/sounds/new-order.mp3'));
    // Filter active orders
    (0, react_1.useEffect)(() => {
        setActiveOrders(orders.filter(order => order.status !== Order_1.OrderStatus.DELIVERED &&
            order.status !== Order_1.OrderStatus.CANCELLED));
    }, [orders]);
    // Play sound on new orders
    (0, react_1.useEffect)(() => {
        const newOrders = orders.filter(order => order.status === Order_1.OrderStatus.PENDING);
        if (newOrders.length > 0) {
            notification.play().catch(console.error);
        }
    }, [orders, notification]);
    // Keyboard shortcuts
    (0, react_hotkeys_hook_1.useHotkeys)('ctrl+1', () => document.getElementById('pending-orders')?.focus());
    (0, react_hotkeys_hook_1.useHotkeys)('ctrl+2', () => document.getElementById('preparing-orders')?.focus());
    (0, react_hotkeys_hook_1.useHotkeys)('ctrl+3', () => document.getElementById('ready-orders')?.focus());
    return (<div className="h-screen flex flex-col bg-gray-100">
            <OrderStatusBar_1.OrderStatusBar totalOrders={activeOrders.length} connected={connected}/>

            <div className="flex-1 p-4">
                <KitchenGrid_1.KitchenGrid orders={activeOrders} priorities={calculatePriorities(activeOrders)}/>
            </div>

            <div className="fixed bottom-4 right-4 space-x-2">
                <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+1</kbd>
                <span className="text-sm">New Orders</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+2</kbd>
                <span className="text-sm">Preparing</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+3</kbd>
                <span className="text-sm">Ready</span>
            </div>
        </div>);
};
exports.KitchenDisplaySystem = KitchenDisplaySystem;
const calculatePriorities = (orders) => {
    return orders.reduce((acc, order) => {
        const waitTime = Date.now() - new Date(order.createdAt).getTime();
        const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
        acc[order.id] = Math.floor((waitTime / 1000 / 60) + (itemCount * 2));
        return acc;
    }, {});
};
