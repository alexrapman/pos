// backend/src/__tests__/websocket/socket.test.ts
import { createServer } from 'http';
import { AddressInfo } from 'net';
import { io as Client } from 'socket.io-client';
import { Server } from 'socket.io';
import { SocketService } from '../../socket';

describe('WebSocket Tests', () => {
  let io: Server;
  let serverSocket: any;
  let clientSocket: any;
  let httpServer: any;

  beforeAll((done) => {
    httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket = Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
    httpServer.close();
  });

  test('should emit order update', (done) => {
    const orderData = {
      orderId: 1,
      status: 'preparing'
    };

    clientSocket.on('orderUpdate', (data: any) => {
      expect(data).toEqual(orderData);
      done();
    });

    serverSocket.emit('orderUpdate', orderData);
  });

  test('should join room', (done) => {
    clientSocket.emit('joinRoom', 'kitchen');
    
    setTimeout(() => {
      const rooms = serverSocket.rooms;
      expect(rooms.has('kitchen')).toBeTruthy();
      done();
    }, 50);
  });

  test('should receive new order notification', (done) => {
    const newOrder = {
      id: 1,
      items: ['Pizza', 'Cola'],
      total: 15
    };

    clientSocket.on('newOrder', (data: any) => {
      expect(data).toEqual(newOrder);
      done();
    });

    serverSocket.emit('newOrder', newOrder);
  });
});