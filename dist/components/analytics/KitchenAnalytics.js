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
exports.KitchenAnalytics = void 0;
// src/components/analytics/KitchenAnalytics.tsx
const react_1 = __importStar(require("react"));
const react_chartjs_2_1 = require("react-chartjs-2");
const file_saver_1 = require("file-saver");
const KitchenAnalytics = () => {
    const [timeRange, setTimeRange] = (0, react_1.useState)('day');
    const [analyticsData, setAnalyticsData] = (0, react_1.useState)({
        orderCompletionTimes: [],
        ordersByHour: new Array(24).fill(0),
        itemPopularity: {}
    });
    (0, react_1.useEffect)(() => {
        fetchAnalyticsData(timeRange);
    }, [timeRange]);
    const exportData = () => {
        const csv = convertToCSV(analyticsData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        (0, file_saver_1.saveAs)(blob, `kitchen-analytics-${timeRange}.csv`);
    };
    return (<div className="p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">Kitchen Performance Analytics</h2>
                <div className="space-x-4">
                    <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="border p-2 rounded">
                        <option value="day">Last 24 Hours</option>
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                    </select>
                    <button onClick={exportData} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Export Data
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Order Completion Times</h3>
                    <react_chartjs_2_1.Line data={getCompletionTimeChartData()}/>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Orders by Hour</h3>
                    <react_chartjs_2_1.Bar data={getOrdersByHourChartData()}/>
                </div>
            </div>
        </div>);
};
exports.KitchenAnalytics = KitchenAnalytics;
