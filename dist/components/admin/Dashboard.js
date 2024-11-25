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
exports.Dashboard = void 0;
// src/components/admin/Dashboard.tsx
const react_1 = __importStar(require("react"));
const socket_io_client_1 = require("socket.io-client");
const LineChart_1 = require("../charts/LineChart");
const SystemStats_1 = require("./SystemStats");
const UserManagement_1 = require("./UserManagement");
const Dashboard = ({ apiUrl }) => {
    const [socket, setSocket] = (0, react_1.useState)(null);
    const [stats, setStats] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        const socketInstance = (0, socket_io_client_1.io)(apiUrl);
        setSocket(socketInstance);
        socketInstance.on('stats:update', (newStats) => {
            setStats(newStats);
        });
        socketInstance.emit('subscribe:monitoring');
        return () => {
            socketInstance.disconnect();
        };
    }, [apiUrl]);
    return (<div className="grid grid-cols-2 gap-4 p-4">
            <div className="col-span-2">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            </div>

            <SystemStats_1.SystemStats stats={stats}/>

            <div className="bg-white p-4 rounded shadow">
                <LineChart_1.LineChart data={stats.sessionHistory || []} title="Active Sessions"/>
            </div>

            <div className="col-span-2">
                <UserManagement_1.UserManagement />
            </div>
        </div>);
};
exports.Dashboard = Dashboard;
