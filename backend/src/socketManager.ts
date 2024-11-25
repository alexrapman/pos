// backend/src/socketManager.ts
import { Server } from 'socket.io';
import { OrderStatus } from './models/Order';

export default function setupWebSockets(server: any) {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        socket.on('join-kitchen', () => {
            socket.join('kitchen');
        });

        socket.on('join-waitstaff', () => {
            socket.join('waitstaff');
        });
    });

    return io;
}