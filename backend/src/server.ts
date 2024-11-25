// backend/src/server.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import sequelize from './config/database';
import { config } from 'dotenv';
import { SocketService } from './socket';
import { OrderController } from './controllers/OrderController';
import { MetricsService } from './services/MetricsService';
import { performanceMonitoring } from './monitoring/performance';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Initialize metrics service
const metricsService = new MetricsService(io);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use(performanceMonitoring);

// Global metrics counters
declare global {
  var requestCount: number;
  var responseTimeAvg: number;
}

global.requestCount = 0;
global.responseTimeAvg = 0;

app.get('/', (req, res) => {
  res.json({ message: 'Restaurant POS API' });
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('update-order', async (data) => {
    const { orderId, status } = data;
    const order = await Order.findByPk(orderId);
    if (order) {
      order.status = status;
      await order.save();
      io.emit('order-updated', order);
    }
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  metricsService.stop();
  httpServer.close(() => {
    process.exit(0);
  });
});

sequelize
  .authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.log('Error connecting to database:', err));

sequelize.sync().then(() => {
  const PORT = process.env.PORT || 3001;
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export { app, io };