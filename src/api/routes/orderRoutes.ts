// src/api/routes/orderRoutes.ts
import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { requirePermission } from '../middleware/permissionMiddleware';
import { Permissions } from '../config/permissions';

const router = Router();
const orderController = new OrderController();

router.post('/',
    requirePermission(Permissions.ORDER.CREATE),
    orderController.createOrder.bind(orderController)
);

router.patch('/:id/status',
    requirePermission(Permissions.ORDER.UPDATE),
    orderController.updateOrderStatus.bind(orderController)
);

router.get('/:id',
    requirePermission(Permissions.ORDER.VIEW),
    orderController.getOrder.bind(orderController)
);

router.get('/',
    requirePermission(Permissions.ORDER.VIEW),
    orderController.getAllOrders.bind(orderController)
);

export { router as orderRouter };