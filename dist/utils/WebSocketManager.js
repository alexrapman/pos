"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketManager = void 0;
// src/utils/WebSocketManager.ts
const socket_io_1 = require("socket.io");
const SessionCleanupService_1 = require("../services/SessionCleanupService");
class WebSocketManager {
    constructor(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: process.env.CLIENT_URL,
                methods: ['GET', 'POST']
            }
        });
        this.sessionCleanup = new SessionCleanupService_1.SessionCleanupService();
        this.initialize();
    }
    initialize() {
        this.io.on('connection', (socket) => {
            socket.on('subscribe:monitoring', async () => {
                const stats = await this.sessionCleanup.getSessionStats();
                socket.emit('stats:update', stats);
            });
        });
        // Broadcast stats every minute
        setInterval(async () => {
            const stats = await this.sessionCleanup.getSessionStats();
            this.io.emit('stats:update', stats);
        }, 60000);
    }
}
exports.WebSocketManager = WebSocketManager;
