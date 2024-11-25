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
exports.OrdersOverview = void 0;
// src/components/dashboard/OrdersOverview.tsx
const react_1 = __importStar(require("react"));
const Order_1 = require("../../models/Order");
const SearchInput_1 = require("../ui/SearchInput");
const OrderStatusBadge_1 = require("../ui/OrderStatusBadge");
const SkeletonLoader_1 = require("../ui/SkeletonLoader");
const toastUtils_1 = require("../../utils/toastUtils");
const OrdersOverview = ({ orders, loading }) => {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)('ALL');
    const [sortBy, setSortBy] = (0, react_1.useState)('date');
    const { notifySuccess } = (0, toastUtils_1.useToastUtils)();
    const filteredOrders = (0, react_1.useMemo)(() => {
        return orders
            .filter(order => {
            const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.tableNumber.toString().includes(searchTerm);
            const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
            .sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'table':
                    return a.tableNumber - b.tableNumber;
                case 'amount':
                    return b.total - a.total;
                default:
                    return 0;
            }
        });
    }, [orders, searchTerm, statusFilter, sortBy]);
    const handleOrderAction = (action) => {
        notifySuccess(`Order ${action} successfully`);
    };
    return (<div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Orders Overview</h2>
                <SearchInput_1.SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search orders..."/>
            </div>

            <div className="flex gap-2 mb-4">
                {['ALL', ...Object.values(Order_1.OrderStatus)].map(status => (<button key={status} onClick={() => setStatusFilter(status)} className={`px-3 py-1 rounded ${statusFilter === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'}`}>
                        {status}
                    </button>))}
            </div>

            {loading ? (<div className="space-y-4">
                    <SkeletonLoader_1.SkeletonLoader count={5} height="h-6"/>
                </div>) : (<table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2">Order ID</th>
                            <th className="text-left py-2">Table</th>
                            <th className="text-left py-2">Status</th>
                            <th className="text-right py-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (<tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="py-2">{order.id}</td>
                                <td className="py-2">Table {order.tableNumber}</td>
                                <td className="py-2">
                                    <OrderStatusBadge_1.OrderStatusBadge status={order.status}/>
                                </td>
                                <td className="py-2 text-right">
                                    ${order.total.toFixed(2)}
                                </td>
                            </tr>))}
                    </tbody>
                </table>)}
        </div>);
};
exports.OrdersOverview = OrdersOverview;
