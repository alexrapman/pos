// src/socket/index.ts
import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';

export class SocketService {
  private io: Server;

  constructor(server: HTTPServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.setupEvents();
  }

  private setupEvents(): void {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('joinRoom', (room) => {
        socket.join(room);
      });

      socket.on('leaveRoom', (room) => {
        socket.leave(room);
      });
    });
  }

  public emitOrderUpdate(orderId: number, status: string): void {
    this.io.to(`order_${orderId}`).emit('orderUpdate', { orderId, status });
  }

  public emitKitchenUpdate(order: any): void {
    this.io.to('kitchen').emit('newOrder', order);
  }
}
