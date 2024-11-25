"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatusBar = void 0;
// src/components/kitchen/OrderStatusBar.tsx
const react_1 = __importDefault(require("react"));
const OrderStatusBar = ({ totalOrders, connected }) => {
    return (<div className="bg-white shadow-md p-4">
            <div className="flex justify-between items-center">
                <div className="flex space-x-6">
                    <div className="text-center">
                        <span className="text-2xl font-bold">{totalOrders}</span>
                        <span className="block text-sm text-gray-500">Active Orders</span>
                    </div>

                    <div className="border-l pl-6">
                        <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}/>
                            <span className="text-sm text-gray-600">
                                {connected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        View Analytics
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                        Settings
                    </button>
                </div>
            </div>
        </div>);
};
exports.OrderStatusBar = OrderStatusBar;
