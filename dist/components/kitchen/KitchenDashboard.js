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
exports.KitchenDashboard = void 0;
// src/components/kitchen/KitchenDashboard.tsx
const react_1 = __importStar(require("react"));
const useOrderSync_1 = require("../../hooks/useOrderSync");
const KitchenGrid_1 = require("./KitchenGrid");
const KitchenDashboard = () => {
    const { orders, connected } = (0, useOrderSync_1.useOrderSync)();
    const [priorities, setPriorities] = (0, react_1.useState)({});
    // Calculate priorities based on wait time and order size
    (0, react_1.useEffect)(() => {
        const newPriorities = orders.reduce((acc, order) => {
            const waitTime = Date.now() - new Date(order.createdAt).getTime();
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
            acc[order.id] = Math.floor((waitTime / 1000 / 60) + (itemCount * 2));
            return acc;
        }, {});
        setPriorities(newPriorities);
    }, [orders]);
    return (<div className="h-screen bg-gray-100 p-4">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Kitchen Display</h1>
                {!connected && (<div className="bg-red-500 text-white px-4 py-2 rounded">
                        Connection Lost - Retrying...
                    </div>)}
            </div>

            <KitchenGrid_1.KitchenGrid orders={orders} priorities={priorities}/>
        </div>);
};
exports.KitchenDashboard = KitchenDashboard;
