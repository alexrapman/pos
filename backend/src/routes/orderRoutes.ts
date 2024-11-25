// backend/src/routes/orderRoutes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/authorize';
import { OrderController } from '../controllers/OrderController';
import { validateOrderId as validateOrder } from '../middleware/validators';

const router = Router();
const orderController = new OrderController();

router.get('/', authenticate, authorizeRoles('admin', 'waiter'), (req, res) => orderController.findAll(req, res));
router.post('/', authenticate, authorizeRoles('waiter', 'customer'), (req, res) => orderController.createOrder(req, res));
router.get('/:id', authenticate, authorizeRoles('admin', 'waiter'), (req, res) => orderController.findById(req, res));
router.patch('/:id/status', authenticate, authorizeRoles('admin', 'waiter'), (req, res) => orderController.updateStatus(req, res));

export default router;
