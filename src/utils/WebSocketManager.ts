// src/utils/WebSocketManager.ts
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { SessionCleanupService } from '../services/SessionCleanupService';

export class WebSocketManager {
    private io: Server;
    private sessionCleanup: SessionCleanupService;

    constructor(server: HttpServer) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.CLIENT_URL,
                methods: ['GET', 'POST']
            }
        });

        this.sessionCleanup = new SessionCleanupService();
        this.initialize();
    }

    private initialize() {
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