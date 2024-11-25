// index.ts
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import routes from './routes';
import { sequelize } from './config/database';
import { Router } from 'express';
import orderRoutes from './order.routes';
import tableRoutes from './table.routes';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use('/orders', authMiddleware, orderRoutes);
router.use('/tables', authMiddleware, tableRoutes);

export default router;

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', router);    

// WebSocket events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinRoom', (room) => {
    socket.join(room);
  });

  socket.on('leaveRoom', (room) => {
    socket.leave(room);
  });
});

// Error handling
app.use(errorHandler);

// Database connection and server start
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    
    await sequelize.sync();
    console.log('Database synchronized');

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export { app, io };

// backend/src/routes/index.ts
import { Router } from 'express';
import orderRoutes from './order.routes';
import tableRoutes from './table.routes';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use('/orders', authMiddleware, orderRoutes);
router.use('/tables', authMiddleware, tableRoutes);

export default router;

// backend/src/routes/order.routes.ts
import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { validateOrder } from '../middleware/validators';

const router = Router();
const controller = new OrderController();

router.post('/', validateOrder, controller.createOrder.bind(controller));
router.get('/', controller.findAll.bind(controller));
router.get('/:id', controller.findById.bind(controller));
router.patch('/:id/status', controller.updateStatus.bind(controller));

export default router;

// backend/src/routes/table.routes.ts
import { Router } from 'express';
import { TableController } from '../controllers/table.controller';
import { validateTable } from '../middleware/validators';

const router = Router();
const controller = new TableController();

router.post('/', validateTable, controller.create.bind(controller));
router.get('/', controller.findAll.bind(controller));
router.get('/available', controller.checkAvailability.bind(controller));
router.get('/:id', controller.findById.bind(controller));
router.patch('/:id', controller.update.bind(controller));

export default router;