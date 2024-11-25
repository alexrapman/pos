// frontend/src/services/socket.ts
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');
    
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });
  }

  joinOrderRoom(orderId: number) {
    this.socket.emit('joinRoom', `order_${orderId}`);
  }

  joinKitchenRoom() {
    this.socket.emit('joinRoom', 'kitchen');
  }

  onOrderUpdate(callback: (data: any) => void) {
    this.socket.on('orderUpdate', callback);
  }

  onNewOrder(callback: (data: any) => void) {
    this.socket.on('newOrder', callback);
  }

  cleanup() {
    this.socket.removeAllListeners();
    this.socket.close();
  }
}

export const socketService = new SocketService();