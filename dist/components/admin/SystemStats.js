"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemStats = void 0;
// src/components/admin/SystemStats.tsx
const react_1 = __importDefault(require("react"));
const Card_1 = require("../ui/Card");
const SystemStats = ({ stats }) => {
    return (<div className="grid grid-cols-2 gap-4">
            <Card_1.Card>
                <h3 className="text-lg font-semibold">Active Sessions</h3>
                <p className="text-3xl">{stats.activeSessions}</p>
            </Card_1.Card>
            <Card_1.Card>
                <h3 className="text-lg font-semibold">Active Orders</h3>
                <p className="text-3xl">{stats.activeOrders}</p>
            </Card_1.Card>
            <Card_1.Card>
                <h3 className="text-lg font-semibold">System Load</h3>
                <p className="text-3xl">{stats.systemLoad}%</p>
            </Card_1.Card>
            <Card_1.Card>
                <h3 className="text-lg font-semibold">Uptime</h3>
                <p className="text-3xl">{stats.uptime}</p>
            </Card_1.Card>
        </div>);
};
exports.SystemStats = SystemStats;
