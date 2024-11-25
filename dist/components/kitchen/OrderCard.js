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
exports.OrderCard = void 0;
// src/components/kitchen/OrderCard.tsx
const react_1 = __importStar(require("react"));
const date_fns_1 = require("date-fns");
const Order_1 = require("../../models/Order");
const CookingInstructions_1 = require("./CookingInstructions");
const OrderCard = ({ order, onStatusChange }) => {
    const [elapsedTime, setElapsedTime] = (0, react_1.useState)('');
    const [isPriority, setIsPriority] = (0, react_1.useState)(false);
    const [showInstructions, setShowInstructions] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const timer = setInterval(() => {
            const elapsed = (0, date_fns_1.formatDistanceToNow)(new Date(order.createdAt));
            setElapsedTime(elapsed);
            // Mark as priority if waiting more than 15 minutes
            const waitTime = Date.now() - new Date(order.createdAt).getTime();
            setIsPriority(waitTime > 15 * 60 * 1000);
        }, 1000);
        return () => clearInterval(timer);
    }, [order.createdAt]);
    const getNextStatus = (currentStatus) => {
        const statusFlow = {
            [Order_1.OrderStatus.PENDING]: Order_1.OrderStatus.PREPARING,
            [Order_1.OrderStatus.PREPARING]: Order_1.OrderStatus.READY,
            [Order_1.OrderStatus.READY]: Order_1.OrderStatus.DELIVERED,
            [Order_1.OrderStatus.DELIVERED]: null
        };
        return statusFlow[currentStatus];
    };
    return (<div className={`
            border rounded-lg p-4
            ${isPriority ? 'border-red-500 bg-red-50' : 'border-gray-200'}
        `}>
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Table {order.tableNumber}</span>
                <span className="text-sm text-gray-500">{elapsedTime} ago</span>
            </div>

            <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (<div key={index} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        {item.notes && (<span className="text-sm text-gray-600">{item.notes}</span>)}
                    </div>))}
            </div>

            <div className="flex justify-between items-center">
                <span className={`
                    px-2 py-1 rounded text-sm
                    ${isPriority ? 'bg-red-100 text-red-800' : 'bg-gray-100'}
                `}>
                    {order.status}
                </span>
                {getNextStatus(order.status) && (<button onClick={() => onStatusChange(getNextStatus(order.status))} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Mark as {getNextStatus(order.status)}
                    </button>)}
            </div>

            <div className="flex justify-between items-center">
                <button onClick={() => setShowInstructions(!showInstructions)} className="text-sm text-blue-600 hover:underline">
                    {showInstructions ? 'Hide' : 'Show'} Instructions
                </button>
                <span className="text-sm text-gray-500">
                    {elapsedTime} ago
                </span>
            </div>

            {showInstructions && (<CookingInstructions_1.CookingInstructions items={order.items}/>)}
        </div>);
};
exports.OrderCard = OrderCard;
