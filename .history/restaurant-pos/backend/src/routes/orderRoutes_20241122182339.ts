// backend/src/routes/orderRoutes.ts
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { authorizeRoles } from '../middleware/authorize';
import { OrderController } from '../controllers/OrderController';

const router = Router();
const orderController = new OrderController();

router.get('/', authenticateToken, authorizeRoles('admin', 'waiter'), (req, res) => orderController.getOrders(req, res));
router.post('/', authenticateToken, authorizeRoles('waiter', 'customer'), (req, res) => orderController.createOrder(req, res));

export default router;